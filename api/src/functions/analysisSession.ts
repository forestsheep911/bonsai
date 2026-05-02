import {
  type HttpRequest,
  type InvocationContext,
  app,
} from "@azure/functions";
import { writeAnalysisSession } from "../analysisStore.js";
import { getClientPrincipal } from "../auth.js";
import { errorResponse, jsonResponse } from "../responses.js";

export async function analysisSession(
  request: HttpRequest,
  _context: InvocationContext,
) {
  const principal = getClientPrincipal(request);
  if (principal === null) {
    return errorResponse(401, "unauthenticated", "Sign in is required.");
  }

  try {
    const payload = await request.json();
    const blobName = await writeAnalysisSession(payload, principal.userId);
    return jsonResponse(202, {
      ok: true,
      blobName,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return errorResponse(500, "analysis-storage-error", message);
  }
}

app.http("analysisSession", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "analysis/session",
  handler: analysisSession,
});
