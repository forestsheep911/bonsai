import type { HttpRequest } from "@azure/functions";
import type { ProjectReport } from "./projectProtocol.js";

interface ReportTokenConfig {
  globalToken?: string;
  projectTokens: Map<string, string>;
}

export interface ProjectReportAuthResult {
  configured: boolean;
  authenticated: boolean;
  projectScoped: boolean;
}

function parseProjectTokens(value: string | undefined) {
  const tokens = new Map<string, string>();
  if (!value) {
    return tokens;
  }

  for (const entry of value.split(",")) {
    const [project, token] = entry.split(":", 2);
    if (!project?.trim() || !token?.trim()) {
      continue;
    }
    tokens.set(project.trim(), token.trim());
  }

  return tokens;
}

function readReportTokenConfig(): ReportTokenConfig {
  return {
    globalToken: process.env.BONSAI_PROJECT_REPORT_TOKEN?.trim() || undefined,
    projectTokens: parseProjectTokens(process.env.BONSAI_PROJECT_REPORT_TOKENS),
  };
}

function readSubmittedToken(request: HttpRequest) {
  const explicitToken = request.headers.get("x-bonsai-report-token")?.trim();
  if (explicitToken) {
    return explicitToken;
  }

  const authorization = request.headers.get("authorization")?.trim();
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim();
}

function matchesProjectToken(
  config: ReportTokenConfig,
  report: ProjectReport,
  submittedToken: string | undefined,
) {
  if (!submittedToken) {
    return false;
  }

  for (const identity of [report.slug, report.projectId]) {
    if (!identity) {
      continue;
    }
    const token = config.projectTokens.get(identity);
    if (token !== undefined && token === submittedToken) {
      return true;
    }
  }

  return false;
}

export function verifyProjectReportAuth(
  request: HttpRequest,
  report: ProjectReport,
): ProjectReportAuthResult {
  const config = readReportTokenConfig();
  const submittedToken = readSubmittedToken(request);
  const configured =
    config.globalToken !== undefined || config.projectTokens.size > 0;
  const projectScoped = matchesProjectToken(config, report, submittedToken);
  const authenticated =
    projectScoped ||
    (config.globalToken !== undefined && config.globalToken === submittedToken);

  return {
    configured,
    authenticated,
    projectScoped,
  };
}
