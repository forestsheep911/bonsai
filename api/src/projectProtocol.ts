export const projectProtocolVersion = "2026-05-03";

export const projectStatuses = [
  "idea",
  "prototype",
  "mvp",
  "live",
  "mature",
  "paused",
  "archived",
] as const;

export const milestoneTypes = [
  "created",
  "status_change",
  "milestone",
  "launch",
  "pause",
  "archive",
  "review",
] as const;

export const linkTypes = [
  "website",
  "github",
  "demo",
  "docs",
  "blog",
  "other",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
export type ProjectMilestoneType = (typeof milestoneTypes)[number];
export type ProjectLinkType = (typeof linkTypes)[number];

export interface ProjectLink {
  type: ProjectLinkType;
  label: string;
  url: string;
}

export interface ProjectMetric {
  key: "users" | "mrr" | "stars" | "visits" | "dau" | "other";
  label: string;
  value: number;
  unit?: string;
}

export interface ProjectMilestone {
  id: string;
  type: ProjectMilestoneType;
  title: string;
  description?: string;
  occurredAt: string;
  fromStatus?: ProjectStatus;
  toStatus?: ProjectStatus;
}

export interface ProjectSnapshot {
  protocolVersion?: typeof projectProtocolVersion;
  id: string;
  userId: string;
  slug: string;
  name: string;
  summary: string;
  status: ProjectStatus;
  tags: string[];
  coverImage?: string;
  links: ProjectLink[];
  metrics: ProjectMetric[];
  milestones: ProjectMilestone[];
  story: string;
  isPublic: boolean;
  visibility: "public" | "private" | "unlisted";
  owner?: string;
  source?: {
    manifestUrl?: string;
    lastReportAt?: string;
    updatedBy?: "manifest" | "report" | "manual";
  };
  runtime?: {
    buildStatus?: "unknown" | "success" | "failed" | "running";
    deployStatus?: "unknown" | "success" | "failed" | "running";
    lastCommitAt?: string;
    lastDeployAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent extends ProjectMilestone {
  projectId: string;
  projectName: string;
  projectSlug: string;
}

export interface ProjectReport {
  protocolVersion?: typeof projectProtocolVersion;
  mode?: "preview" | "apply";
  projectId?: string;
  slug?: string;
  status?: ProjectStatus;
  summary?: string;
  links?: ProjectLink[];
  metrics?: ProjectMetric[];
  milestones?: ProjectMilestone[];
  buildStatus?: "unknown" | "success" | "failed" | "running";
  deployStatus?: "unknown" | "success" | "failed" | "running";
  lastCommitAt?: string;
  lastDeployAt?: string;
  reportedAt: string;
  source?: {
    type: "ci" | "api" | "manual";
    name?: string;
    url?: string;
  };
}

export interface ManifestValidationIssue {
  path: string;
  code: string;
  message: string;
}

export interface ManifestValidationResult {
  valid: boolean;
  issues: ManifestValidationIssue[];
}

const metricKeys = ["users", "mrr", "stars", "visits", "dau", "other"] as const;
const visibilityValues = ["public", "private", "unlisted"] as const;
const runtimeStatuses = ["unknown", "success", "failed", "running"] as const;
const manifestFields = new Set([
  "protocolVersion",
  "id",
  "slug",
  "name",
  "summary",
  "status",
  "tags",
  "coverImage",
  "links",
  "metrics",
  "milestones",
  "visibility",
  "owner",
  "source",
  "story",
  "createdAt",
  "updatedAt",
]);
const reportFields = new Set([
  "protocolVersion",
  "mode",
  "projectId",
  "slug",
  "status",
  "summary",
  "links",
  "metrics",
  "milestones",
  "buildStatus",
  "deployStatus",
  "lastCommitAt",
  "lastDeployAt",
  "reportedAt",
  "source",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value: unknown) {
  if (typeof value !== "string") return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isIsoDateTime(value: unknown) {
  if (typeof value !== "string") return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && value.includes("T");
}

function pushRequiredStringIssue(
  issues: ManifestValidationIssue[],
  manifest: Record<string, unknown>,
  field: string,
) {
  if (!isNonEmptyString(manifest[field])) {
    issues.push({
      path: field,
      code: "required-string",
      message: `${field} must be a non-empty string.`,
    });
  }
}

function validateProtocolVersion(
  issues: ManifestValidationIssue[],
  value: Record<string, unknown>,
) {
  if (
    value.protocolVersion !== undefined &&
    value.protocolVersion !== projectProtocolVersion
  ) {
    issues.push({
      path: "protocolVersion",
      code: "unsupported-protocol-version",
      message: `protocolVersion must be ${projectProtocolVersion} when provided.`,
    });
  }
}

function validateAllowedFields(
  issues: ManifestValidationIssue[],
  value: Record<string, unknown>,
  allowedFields: Set<string>,
) {
  for (const field of Object.keys(value)) {
    if (!allowedFields.has(field)) {
      issues.push({
        path: field,
        code: "unsupported-field",
        message: `${field} is not supported by this protocol.`,
      });
    }
  }
}

function validateStringArray(
  issues: ManifestValidationIssue[],
  value: unknown,
  path: string,
) {
  if (!Array.isArray(value)) {
    issues.push({
      path,
      code: "required-array",
      message: `${path} must be an array.`,
    });
    return;
  }

  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) {
      issues.push({
        path: `${path}.${index}`,
        code: "invalid-string",
        message: `${path}[${index}] must be a non-empty string.`,
      });
    }
  });
}

export function validateProjectManifest(
  value: unknown,
): ManifestValidationResult {
  const issues: ManifestValidationIssue[] = [];

  if (!isRecord(value)) {
    return {
      valid: false,
      issues: [
        {
          path: "$",
          code: "invalid-object",
          message: "Manifest must be a JSON object.",
        },
      ],
    };
  }

  validateProtocolVersion(issues, value);
  validateAllowedFields(issues, value, manifestFields);

  for (const field of ["id", "slug", "name", "summary", "story"]) {
    pushRequiredStringIssue(issues, value, field);
  }

  if (!projectStatuses.includes(value.status as ProjectStatus)) {
    issues.push({
      path: "status",
      code: "invalid-status",
      message: `status must be one of: ${projectStatuses.join(", ")}.`,
    });
  }

  validateStringArray(issues, value.tags, "tags");

  if (!Array.isArray(value.links)) {
    issues.push({
      path: "links",
      code: "required-array",
      message: "links must be an array.",
    });
  } else {
    value.links.forEach((link, index) => {
      if (!isRecord(link)) {
        issues.push({
          path: `links.${index}`,
          code: "invalid-object",
          message: `links[${index}] must be an object.`,
        });
        return;
      }

      if (!linkTypes.includes(link.type as ProjectLinkType)) {
        issues.push({
          path: `links.${index}.type`,
          code: "invalid-link-type",
          message: `links[${index}].type must be one of: ${linkTypes.join(", ")}.`,
        });
      }
      if (!isNonEmptyString(link.label)) {
        issues.push({
          path: `links.${index}.label`,
          code: "required-string",
          message: `links[${index}].label must be a non-empty string.`,
        });
      }
      if (!isValidUrl(link.url)) {
        issues.push({
          path: `links.${index}.url`,
          code: "invalid-url",
          message: `links[${index}].url must be a valid URL.`,
        });
      }
    });
  }

  if (value.coverImage !== undefined && !isValidUrl(value.coverImage)) {
    issues.push({
      path: "coverImage",
      code: "invalid-url",
      message: "coverImage must be a valid URL when provided.",
    });
  }

  if (value.metrics !== undefined) {
    if (!Array.isArray(value.metrics)) {
      issues.push({
        path: "metrics",
        code: "invalid-array",
        message: "metrics must be an array when provided.",
      });
    } else {
      value.metrics.forEach((metric, index) => {
        if (!isRecord(metric)) {
          issues.push({
            path: `metrics.${index}`,
            code: "invalid-object",
            message: `metrics[${index}] must be an object.`,
          });
          return;
        }
        if (!metricKeys.includes(metric.key as (typeof metricKeys)[number])) {
          issues.push({
            path: `metrics.${index}.key`,
            code: "invalid-metric-key",
            message: `metrics[${index}].key is not supported.`,
          });
        }
        if (!isNonEmptyString(metric.label)) {
          issues.push({
            path: `metrics.${index}.label`,
            code: "required-string",
            message: `metrics[${index}].label must be a non-empty string.`,
          });
        }
        if (typeof metric.value !== "number" || !Number.isFinite(metric.value)) {
          issues.push({
            path: `metrics.${index}.value`,
            code: "invalid-number",
            message: `metrics[${index}].value must be a finite number.`,
          });
        }
      });
    }
  }

  if (value.milestones !== undefined) {
    if (!Array.isArray(value.milestones)) {
      issues.push({
        path: "milestones",
        code: "invalid-array",
        message: "milestones must be an array when provided.",
      });
    } else {
      value.milestones.forEach((milestone, index) => {
        if (!isRecord(milestone)) {
          issues.push({
            path: `milestones.${index}`,
            code: "invalid-object",
            message: `milestones[${index}] must be an object.`,
          });
          return;
        }
        if (!isNonEmptyString(milestone.id)) {
          issues.push({
            path: `milestones.${index}.id`,
            code: "required-string",
            message: `milestones[${index}].id must be a non-empty string.`,
          });
        }
        if (!milestoneTypes.includes(milestone.type as ProjectMilestoneType)) {
          issues.push({
            path: `milestones.${index}.type`,
            code: "invalid-milestone-type",
            message: `milestones[${index}].type is not supported.`,
          });
        }
        if (!isNonEmptyString(milestone.title)) {
          issues.push({
            path: `milestones.${index}.title`,
            code: "required-string",
            message: `milestones[${index}].title must be a non-empty string.`,
          });
        }
        if (!isIsoDateTime(milestone.occurredAt)) {
          issues.push({
            path: `milestones.${index}.occurredAt`,
            code: "invalid-datetime",
            message: `milestones[${index}].occurredAt must be an ISO date-time string.`,
          });
        }
      });
    }
  }

  if (!isIsoDateTime(value.createdAt)) {
    issues.push({
      path: "createdAt",
      code: "invalid-datetime",
      message: "createdAt must be an ISO date-time string.",
    });
  }

  if (!isIsoDateTime(value.updatedAt)) {
    issues.push({
      path: "updatedAt",
      code: "invalid-datetime",
      message: "updatedAt must be an ISO date-time string.",
    });
  }

  if (
    value.visibility !== undefined &&
    !visibilityValues.includes(value.visibility as (typeof visibilityValues)[number])
  ) {
    issues.push({
      path: "visibility",
      code: "invalid-visibility",
      message: `visibility must be one of: ${visibilityValues.join(", ")}.`,
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function validateProjectReport(value: unknown): ManifestValidationResult {
  const issues: ManifestValidationIssue[] = [];

  if (!isRecord(value)) {
    return {
      valid: false,
      issues: [
        {
          path: "$",
          code: "invalid-object",
          message: "Report must be a JSON object.",
        },
      ],
    };
  }

  validateProtocolVersion(issues, value);
  validateAllowedFields(issues, value, reportFields);

  if (!isNonEmptyString(value.projectId) && !isNonEmptyString(value.slug)) {
    issues.push({
      path: "projectId",
      code: "missing-project-identity",
      message: "Report must include projectId or slug.",
    });
  }

  const hasReportField =
    value.status !== undefined ||
    value.summary !== undefined ||
    value.links !== undefined ||
    value.metrics !== undefined ||
    value.milestones !== undefined ||
    value.buildStatus !== undefined ||
    value.deployStatus !== undefined ||
    value.lastCommitAt !== undefined ||
    value.lastDeployAt !== undefined;

  if (!hasReportField) {
    issues.push({
      path: "$",
      code: "empty-report",
      message:
        "Report must include at least one project field or runtime field.",
    });
  }

  if (value.status !== undefined && !projectStatuses.includes(value.status as ProjectStatus)) {
    issues.push({
      path: "status",
      code: "invalid-status",
      message: `status must be one of: ${projectStatuses.join(", ")}.`,
    });
  }

  if (value.summary !== undefined && !isNonEmptyString(value.summary)) {
    issues.push({
      path: "summary",
      code: "required-string",
      message: "summary must be a non-empty string when provided.",
    });
  }

  if (value.links !== undefined) {
    if (!Array.isArray(value.links)) {
      issues.push({
        path: "links",
        code: "invalid-array",
        message: "links must be an array when provided.",
      });
    } else {
      value.links.forEach((link, index) => {
        if (!isRecord(link)) {
          issues.push({
            path: `links.${index}`,
            code: "invalid-object",
            message: `links[${index}] must be an object.`,
          });
          return;
        }
        if (!linkTypes.includes(link.type as ProjectLinkType)) {
          issues.push({
            path: `links.${index}.type`,
            code: "invalid-link-type",
            message: `links[${index}].type must be one of: ${linkTypes.join(", ")}.`,
          });
        }
        if (!isNonEmptyString(link.label)) {
          issues.push({
            path: `links.${index}.label`,
            code: "required-string",
            message: `links[${index}].label must be a non-empty string.`,
          });
        }
        if (!isValidUrl(link.url)) {
          issues.push({
            path: `links.${index}.url`,
            code: "invalid-url",
            message: `links[${index}].url must be a valid URL.`,
          });
        }
      });
    }
  }

  if (value.metrics !== undefined) {
    if (!Array.isArray(value.metrics)) {
      issues.push({
        path: "metrics",
        code: "invalid-array",
        message: "metrics must be an array when provided.",
      });
    } else {
      value.metrics.forEach((metric, index) => {
        if (!isRecord(metric)) {
          issues.push({
            path: `metrics.${index}`,
            code: "invalid-object",
            message: `metrics[${index}] must be an object.`,
          });
          return;
        }
        if (!metricKeys.includes(metric.key as (typeof metricKeys)[number])) {
          issues.push({
            path: `metrics.${index}.key`,
            code: "invalid-metric-key",
            message: `metrics[${index}].key is not supported.`,
          });
        }
        if (!isNonEmptyString(metric.label)) {
          issues.push({
            path: `metrics.${index}.label`,
            code: "required-string",
            message: `metrics[${index}].label must be a non-empty string.`,
          });
        }
        if (typeof metric.value !== "number" || !Number.isFinite(metric.value)) {
          issues.push({
            path: `metrics.${index}.value`,
            code: "invalid-number",
            message: `metrics[${index}].value must be a finite number.`,
          });
        }
      });
    }
  }

  if (value.milestones !== undefined) {
    if (!Array.isArray(value.milestones)) {
      issues.push({
        path: "milestones",
        code: "invalid-array",
        message: "milestones must be an array when provided.",
      });
    } else {
      value.milestones.forEach((milestone, index) => {
        if (!isRecord(milestone)) {
          issues.push({
            path: `milestones.${index}`,
            code: "invalid-object",
            message: `milestones[${index}] must be an object.`,
          });
          return;
        }
        if (!isNonEmptyString(milestone.id)) {
          issues.push({
            path: `milestones.${index}.id`,
            code: "required-string",
            message: `milestones[${index}].id must be a non-empty string.`,
          });
        }
        if (!milestoneTypes.includes(milestone.type as ProjectMilestoneType)) {
          issues.push({
            path: `milestones.${index}.type`,
            code: "invalid-milestone-type",
            message: `milestones[${index}].type is not supported.`,
          });
        }
        if (!isNonEmptyString(milestone.title)) {
          issues.push({
            path: `milestones.${index}.title`,
            code: "required-string",
            message: `milestones[${index}].title must be a non-empty string.`,
          });
        }
        if (!isIsoDateTime(milestone.occurredAt)) {
          issues.push({
            path: `milestones.${index}.occurredAt`,
            code: "invalid-datetime",
            message: `milestones[${index}].occurredAt must be an ISO date-time string.`,
          });
        }
      });
    }
  }

  if (!isIsoDateTime(value.reportedAt)) {
    issues.push({
      path: "reportedAt",
      code: "invalid-datetime",
      message: "reportedAt must be an ISO date-time string.",
    });
  }

  for (const field of ["lastCommitAt", "lastDeployAt"]) {
    if (value[field] !== undefined && !isIsoDateTime(value[field])) {
      issues.push({
        path: field,
        code: "invalid-datetime",
        message: `${field} must be an ISO date-time string when provided.`,
      });
    }
  }

  for (const field of ["buildStatus", "deployStatus"]) {
    if (
      value[field] !== undefined &&
      !runtimeStatuses.includes(value[field] as (typeof runtimeStatuses)[number])
    ) {
      issues.push({
        path: field,
        code: "invalid-runtime-status",
        message: `${field} must be one of: ${runtimeStatuses.join(", ")}.`,
      });
    }
  }

  if (value.source !== undefined) {
    if (!isRecord(value.source)) {
      issues.push({
        path: "source",
        code: "invalid-object",
        message: "source must be an object when provided.",
      });
    } else {
      const sourceTypes = ["ci", "api", "manual"] as const;
      if (!sourceTypes.includes(value.source.type as (typeof sourceTypes)[number])) {
        issues.push({
          path: "source.type",
          code: "invalid-source-type",
          message: `source.type must be one of: ${sourceTypes.join(", ")}.`,
        });
      }
      if (value.source.url !== undefined && !isValidUrl(value.source.url)) {
        issues.push({
          path: "source.url",
          code: "invalid-url",
          message: "source.url must be a valid URL when provided.",
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export const projectManifestJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://bonsai.local/schemas/project-manifest.schema.json",
  title: "Bonsai ProjectManifest",
  type: "object",
  additionalProperties: false,
  required: [
    "id",
    "slug",
    "name",
    "summary",
    "status",
    "tags",
    "links",
    "story",
    "createdAt",
    "updatedAt",
  ],
  properties: {
    protocolVersion: { const: projectProtocolVersion },
    id: { type: "string", minLength: 1 },
    slug: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    summary: { type: "string", minLength: 1 },
    status: { type: "string", enum: projectStatuses },
    tags: { type: "array", items: { type: "string", minLength: 1 } },
    coverImage: { type: "string", format: "uri" },
    links: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "label", "url"],
        properties: {
          type: { type: "string", enum: linkTypes },
          label: { type: "string", minLength: 1 },
          url: { type: "string", format: "uri" },
        },
      },
    },
    metrics: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["key", "label", "value"],
        properties: {
          key: {
            type: "string",
            enum: ["users", "mrr", "stars", "visits", "dau", "other"],
          },
          label: { type: "string", minLength: 1 },
          value: { type: "number" },
          unit: { type: "string" },
        },
      },
    },
    milestones: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "type", "title", "occurredAt"],
        properties: {
          id: { type: "string", minLength: 1 },
          type: { type: "string", enum: milestoneTypes },
          title: { type: "string", minLength: 1 },
          description: { type: "string" },
          occurredAt: { type: "string", format: "date-time" },
          fromStatus: { type: "string", enum: projectStatuses },
          toStatus: { type: "string", enum: projectStatuses },
        },
      },
    },
    visibility: {
      type: "string",
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    owner: { type: "string" },
    source: {
      type: "object",
      additionalProperties: false,
      properties: {
        type: { type: "string", enum: ["bonsai_json", "manual", "api", "ci"] },
        url: { type: "string", format: "uri" },
        repository: { type: "string" },
      },
    },
    story: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

export const projectReportJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://bonsai.local/schemas/project-report.schema.json",
  title: "Bonsai ProjectReport",
  description:
    "Incremental project status report. Reports are validated and previewed by the current API; persistence is intentionally not enabled yet.",
  type: "object",
  additionalProperties: false,
  allOf: [
    {
      anyOf: [{ required: ["projectId"] }, { required: ["slug"] }],
    },
    {
      anyOf: [
        { required: ["status"] },
        { required: ["summary"] },
        { required: ["links"] },
        { required: ["metrics"] },
        { required: ["milestones"] },
        { required: ["buildStatus"] },
        { required: ["deployStatus"] },
        { required: ["lastCommitAt"] },
        { required: ["lastDeployAt"] },
      ],
    },
  ],
  required: ["reportedAt"],
  properties: {
    protocolVersion: { const: projectProtocolVersion },
    mode: { type: "string", enum: ["preview", "apply"], default: "preview" },
    projectId: { type: "string", minLength: 1 },
    slug: { type: "string", minLength: 1 },
    status: { type: "string", enum: projectStatuses },
    summary: { type: "string", minLength: 1 },
    links: projectManifestJsonSchema.properties.links,
    metrics: projectManifestJsonSchema.properties.metrics,
    milestones: projectManifestJsonSchema.properties.milestones,
    buildStatus: { type: "string", enum: runtimeStatuses },
    deployStatus: { type: "string", enum: runtimeStatuses },
    lastCommitAt: { type: "string", format: "date-time" },
    lastDeployAt: { type: "string", format: "date-time" },
    reportedAt: { type: "string", format: "date-time" },
    source: {
      type: "object",
      additionalProperties: false,
      required: ["type"],
      properties: {
        type: { type: "string", enum: ["ci", "api", "manual"] },
        name: { type: "string" },
        url: { type: "string", format: "uri" },
      },
    },
  },
} as const;
