import { z } from "zod";

export const projectStatusSchema = z.enum([
  "idea",
  "prototype",
  "mvp",
  "live",
  "mature",
  "paused",
  "archived",
]);

export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const projectStatusMeta: Record<
  ProjectStatus,
  {
    label: string;
    icon: string;
    description: string;
  }
> = {
  idea: {
    label: "种子",
    icon: "🌱",
    description: "只是个想法，可能只有一段描述",
  },
  prototype: {
    label: "嫩芽",
    icon: "🌿",
    description: "跑通了核心 demo，丑陋但能用",
  },
  mvp: {
    label: "幼苗",
    icon: "🪴",
    description: "可发布的最小可用版本",
  },
  live: {
    label: "成型",
    icon: "🌳",
    description: "正在线上运行，有真实用户",
  },
  mature: {
    label: "老桩",
    icon: "🎋",
    description: "稳定运营，迭代变缓",
  },
  paused: {
    label: "休眠",
    icon: "💤",
    description: "暂停浇水，未来可能继续",
  },
  archived: {
    label: "入库",
    icon: "📦",
    description: "不再打理，但留作纪念",
  },
};

export const projectLinkSchema = z.object({
  type: z.enum(["website", "github", "demo", "docs", "blog", "other"]),
  label: z.string().min(1),
  url: z.string().url(),
});

export const projectMilestoneSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    "created",
    "status_change",
    "milestone",
    "launch",
    "pause",
    "archive",
    "review",
  ]),
  title: z.string().min(1),
  description: z.string().optional(),
  occurredAt: z.string().datetime(),
  fromStatus: projectStatusSchema.optional(),
  toStatus: projectStatusSchema.optional(),
});

export const projectMetricSchema = z.object({
  key: z.enum(["users", "mrr", "stars", "visits", "dau", "other"]),
  label: z.string().min(1),
  value: z.number(),
  unit: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1).default("owner"),
  slug: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  status: projectStatusSchema,
  tags: z.array(z.string().min(1)).default([]),
  coverImage: z.string().url().optional(),
  links: z.array(projectLinkSchema).default([]),
  metrics: z.array(projectMetricSchema).default([]),
  milestones: z.array(projectMilestoneSchema).default([]),
  story: z.string().default(""),
  isPublic: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const projectManifestSchema = projectSchema
  .omit({
    userId: true,
    isPublic: true,
  })
  .extend({
    owner: z.string().min(1).optional(),
    visibility: z.enum(["public", "private", "unlisted"]).default("public"),
    source: z
      .object({
        type: z.enum(["bonsai_json", "manual", "api", "ci"]),
        url: z.string().url().optional(),
        repository: z.string().optional(),
      })
      .optional(),
  });

export const projectReportSchema = z.object({
  projectId: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  status: projectStatusSchema.optional(),
  summary: z.string().min(1).optional(),
  links: z.array(projectLinkSchema).optional(),
  metrics: z.array(projectMetricSchema).optional(),
  milestones: z.array(projectMilestoneSchema).optional(),
  buildStatus: z.enum(["unknown", "success", "failed", "running"]).optional(),
  deployStatus: z.enum(["unknown", "success", "failed", "running"]).optional(),
  lastCommitAt: z.string().datetime().optional(),
  lastDeployAt: z.string().datetime().optional(),
  reportedAt: z.string().datetime(),
  source: z
    .object({
      type: z.enum(["ci", "api", "manual"]),
      name: z.string().optional(),
      url: z.string().url().optional(),
    })
    .optional(),
});

export const projectSnapshotSchema = projectSchema.extend({
  owner: z.string().min(1).optional(),
  visibility: z.enum(["public", "private", "unlisted"]).default("public"),
  source: z
    .object({
      manifestUrl: z.string().url().optional(),
      lastReportAt: z.string().datetime().optional(),
      updatedBy: z.enum(["manifest", "report", "manual"]).optional(),
    })
    .optional(),
});

export const projectListSchema = z.array(projectSchema);
export const projectManifestListSchema = z.array(projectManifestSchema);
export const projectSnapshotListSchema = z.array(projectSnapshotSchema);

export type ProjectLink = z.infer<typeof projectLinkSchema>;
export type ProjectMilestone = z.infer<typeof projectMilestoneSchema>;
export type ProjectMetric = z.infer<typeof projectMetricSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectManifest = z.infer<typeof projectManifestSchema>;
export type ProjectReport = z.infer<typeof projectReportSchema>;
export type ProjectSnapshot = z.infer<typeof projectSnapshotSchema>;

