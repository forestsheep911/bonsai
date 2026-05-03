import {
  type HttpRequest,
  type InvocationContext,
  app,
} from "@azure/functions";
import { errorResponse, jsonResponse } from "../responses.js";
import {
  projectManifestJsonSchema,
  projectProtocolVersion,
  projectReportJsonSchema,
  linkTypes,
  milestoneTypes,
  projectStatuses,
  validateProjectReport,
  validateProjectManifest,
  type ProjectReport,
} from "../projectProtocol.js";
import { verifyProjectReportAuth } from "../projectReportAuth.js";
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

export async function help(_request: HttpRequest, _context: InvocationContext) {
  return jsonResponse(200, {
    ok: true,
    service: "Bonsai Project Garden API",
    protocolVersion: projectProtocolVersion,
    audience:
      "AI agents, CLI tools, CI jobs, and terminals that need to read or report project status.",
    basePath: "/api",
    guidance: [
      "Use GET /api/help first to discover the protocol.",
      "Use GET /api/projects/schema for the full ProjectManifest JSON Schema.",
      "Use GET /api/projects/report/schema for the incremental ProjectReport JSON Schema.",
      "Use POST /api/projects/validate to check a complete bonsai.json manifest before sending it elsewhere.",
      "Use POST /api/projects/report to submit an incremental project status or runtime report. The current implementation returns a merge preview and does not persist the report yet.",
      "Set mode to preview for a dry run. mode=apply is reserved for future persistence and requires a report token.",
      "Dates must be ISO date-time strings, for example 2026-05-03T07:30:00.000Z.",
    ],
    authentication: {
      preview: "Anonymous preview is allowed while persistence is disabled.",
      apply:
        "Future apply requests must include Authorization: Bearer <token> or x-bonsai-report-token.",
      configuration: [
        "BONSAI_PROJECT_REPORT_TOKEN sets one global report token.",
        "BONSAI_PROJECT_REPORT_TOKENS sets project-scoped tokens as slug:token,other-slug:token.",
      ],
    },
    vocabulary: {
      statuses: projectStatuses,
      linkTypes,
      milestoneTypes,
      metricKeys: ["users", "mrr", "stars", "visits", "dau", "other"],
      runtimeStatuses: ["unknown", "success", "failed", "running"],
    },
    endpoints: [
      {
        method: "GET",
        path: "/api/projects",
        purpose: "List public project snapshots.",
      },
      {
        method: "GET",
        path: "/api/projects/{slug}",
        purpose: "Read one public project snapshot by slug.",
      },
      {
        method: "GET",
        path: "/api/timeline",
        purpose: "List cross-project timeline events.",
      },
      {
        method: "GET",
        path: "/api/projects/schema",
        purpose: "Return the ProjectManifest JSON Schema.",
      },
      {
        method: "GET",
        path: "/api/projects/report/schema",
        purpose: "Return the ProjectReport JSON Schema.",
      },
      {
        method: "POST",
        path: "/api/projects/validate",
        purpose: "Validate a complete ProjectManifest JSON object.",
      },
      {
        method: "POST",
        path: "/api/projects/report",
        purpose: "Validate and preview an incremental ProjectReport.",
      },
    ],
    projectReportShape: {
      protocolVersion: projectProtocolVersion,
      modes: ["preview", "apply"],
      required: [
        "projectId or slug",
        "reportedAt",
        "at least one project field or runtime field",
      ],
      identityFields: ["projectId", "slug"],
      patchFields: ["status", "summary", "links", "metrics", "milestones"],
      telemetryFields: [
        "buildStatus",
        "deployStatus",
        "lastCommitAt",
        "lastDeployAt",
        "source",
      ],
    },
    examples: {
      reportProjectStatus: {
        method: "POST",
        path: "/api/projects/report",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: {
          protocolVersion: projectProtocolVersion,
          mode: "preview",
          slug: "factory-soon",
          status: "live",
          summary: "Factory Soon is live and receiving small polish updates.",
          deployStatus: "success",
          lastDeployAt: "2026-05-03T07:30:00.000Z",
          reportedAt: "2026-05-03T07:30:05.000Z",
          source: {
            type: "ci",
            name: "GitHub Actions",
            url: "https://github.com/forestsheep911/factory-soon/actions",
          },
        },
      },
      reportDeployStatus: {
        method: "POST",
        path: "/api/projects/report",
        body: {
          protocolVersion: projectProtocolVersion,
          mode: "preview",
          slug: "factory-soon",
          deployStatus: "success",
          lastDeployAt: "2026-05-03T07:30:00.000Z",
          reportedAt: "2026-05-03T07:30:05.000Z",
          source: {
            type: "ci",
            name: "GitHub Actions",
            url: "https://github.com/forestsheep911/factory-soon/actions",
          },
        },
      },
      addMilestone: {
        method: "POST",
        path: "/api/projects/report",
        body: {
          protocolVersion: projectProtocolVersion,
          mode: "preview",
          slug: "factory-soon",
          milestones: [
            {
              id: "factory-soon-launch-2026-05-03",
              type: "launch",
              title: "Production launch",
              description: "Published the first public build.",
              occurredAt: "2026-05-03T07:30:00.000Z",
            },
          ],
          reportedAt: "2026-05-03T07:31:00.000Z",
          source: {
            type: "manual",
            name: "terminal",
          },
        },
      },
    },
  });
}

export async function projectReportSchema(
  _request: HttpRequest,
  _context: InvocationContext,
) {
  return jsonResponse(200, {
    ok: true,
    schema: projectReportJsonSchema,
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

  const report = body as ProjectReport;
  const mode = report.mode ?? "preview";
  const auth = verifyProjectReportAuth(request, report);

  if (mode === "apply") {
    if (!auth.configured) {
      return errorResponse(
        503,
        "report-auth-not-configured",
        "Project report apply mode requires BONSAI_PROJECT_REPORT_TOKEN or BONSAI_PROJECT_REPORT_TOKENS.",
      );
    }

    if (!auth.authenticated) {
      return errorResponse(
        401,
        "invalid-report-token",
        "A valid project report token is required for apply mode.",
      );
    }

    return errorResponse(
      501,
      "report-apply-not-implemented",
      "Project report apply mode is reserved for future persistence and is not implemented yet.",
    );
  }

  const repository = getProjectRepository();
  const preview = await repository.previewReport(report);
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
    mode,
    auth: {
      configured: auth.configured,
      authenticated: auth.authenticated,
      projectScoped: auth.projectScoped,
    },
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

app.http("projectReportSchema", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "projects/report/schema",
  handler: projectReportSchema,
});

app.http("help", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "help",
  handler: help,
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
