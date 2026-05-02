import {
  type HttpRequest,
  type InvocationContext,
  app,
} from "@azure/functions";
import { errorResponse, jsonResponse } from "../responses.js";
import {
  projectManifestJsonSchema,
  validateProjectReport,
  validateProjectManifest,
  type ProjectReport,
} from "../projectProtocol.js";
import { getProjectRepository } from "../projectRepository.js";

function getSlug(request: HttpRequest) {
  const value = request.params.slug;
  return typeof value === "string" ? value : null;
}

export async function projects(request: HttpRequest, _context: InvocationContext) {
  const slug = getSlug(request);
  const repository = getProjectRepository();

  if (slug === null) {
    return jsonResponse(200, {
      ok: true,
      projects: await repository.listProjects(),
    });
  }

  const project = await repository.readProject(slug);
  if (project === null) {
    return errorResponse(404, "project-not-found", "Project was not found.");
  }

  return jsonResponse(200, {
    ok: true,
    project,
  });
}

export async function timeline(_request: HttpRequest, _context: InvocationContext) {
  const repository = getProjectRepository();

  return jsonResponse(200, {
    ok: true,
    events: await repository.listTimelineEvents(),
  });
}

export async function projectSchema(
  _request: HttpRequest,
  _context: InvocationContext,
) {
  return jsonResponse(200, {
    ok: true,
    schema: projectManifestJsonSchema,
  });
}

export async function validateProject(
  request: HttpRequest,
  _context: InvocationContext,
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid-json", "Request body must be valid JSON.");
  }

  const result = validateProjectManifest(body);

  return jsonResponse(result.valid ? 200 : 422, {
    ok: result.valid,
    valid: result.valid,
    issues: result.issues,
  });
}

export async function reportProject(
  request: HttpRequest,
  _context: InvocationContext,
) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid-json", "Request body must be valid JSON.");
  }

  const result = validateProjectReport(body);
  if (!result.valid) {
    return jsonResponse(422, {
      ok: false,
      valid: false,
      issues: result.issues,
    });
  }

  const repository = getProjectRepository();
  const preview = await repository.previewReport(body as ProjectReport);
  if (preview === null) {
    return errorResponse(
      404,
      "project-not-found",
      "Report target project was not found.",
    );
  }

  return jsonResponse(200, {
    ok: true,
    valid: true,
    mode: "preview",
    project: preview,
  });
}

app.http("projects", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "projects",
  handler: projects,
});

app.http("projectSchema", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "projects/schema",
  handler: projectSchema,
});

app.http("projectValidate", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "projects/validate",
  handler: validateProject,
});

app.http("projectReport", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "projects/report",
  handler: reportProject,
});

app.http("projectBySlug", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "projects/{slug}",
  handler: projects,
});

app.http("timeline", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "timeline",
  handler: timeline,
});
