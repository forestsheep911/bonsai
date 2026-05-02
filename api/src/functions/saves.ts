import {
  type HttpRequest,
  type InvocationContext,
  app,
} from "@azure/functions";
import { getClientPrincipal } from "../auth.js";
import { errorResponse, jsonResponse } from "../responses.js";
import {
  isValidSlotId,
  listSaves,
  readSave,
  upsertSave,
} from "../saveStore.js";

function getSlotId(request: HttpRequest) {
  const value = request.params.slotId;
  return typeof value === "string" ? value : null;
}

function readAppBuild(request: HttpRequest) {
  return request.headers.get("x-factory-soon-build") ?? "unknown";
}

function isCosmosConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 412
  );
}

export async function saves(request: HttpRequest, _context: InvocationContext) {
  const principal = getClientPrincipal(request);
  if (principal === null) {
    return errorResponse(401, "unauthenticated", "Sign in is required.");
  }

  try {
    const slotId = getSlotId(request);
    if (request.method === "GET" && slotId === null) {
      const savesList = await listSaves(principal.userId);
      return jsonResponse(200, {
        ok: true,
        saves: savesList,
      });
    }

    if (slotId === null || !isValidSlotId(slotId)) {
      return errorResponse(400, "invalid-slot", "Unknown save slot.");
    }

    if (request.method === "GET") {
      const result = await readSave(principal.userId, slotId);
      if (result === null) {
        return errorResponse(404, "save-not-found", "Save slot was not found.");
      }

      return jsonResponse(200, {
        ok: true,
        slotId,
        save: result.document.save,
        updatedAtIso: result.document.updatedAtIso,
        etag: result.etag,
      });
    }

    if (request.method === "PUT") {
      const body = (await request.json()) as { save?: unknown };
      const ifMatch = request.headers.get("if-match") ?? undefined;
      const result = await upsertSave(
        principal.userId,
        slotId,
        body.save,
        readAppBuild(request),
        ifMatch,
      );

      return jsonResponse(200, {
        ok: true,
        slotId,
        updatedAtIso: result.document.updatedAtIso,
        etag: result.etag,
      });
    }

    return errorResponse(405, "method-not-allowed", "Method is not allowed.");
  } catch (error) {
    if (isCosmosConflict(error)) {
      return errorResponse(
        409,
        "save-conflict",
        "The cloud save changed before this write completed.",
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error.";
    return errorResponse(500, "save-storage-error", message);
  }
}

app.http("saves", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "saves",
  handler: saves,
});

app.http("saveSlot", {
  methods: ["GET", "PUT"],
  authLevel: "anonymous",
  route: "saves/{slotId}",
  handler: saves,
});
