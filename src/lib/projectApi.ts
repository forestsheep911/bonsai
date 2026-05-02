import { mockProjects } from "@/data/mock";
import {
  projectSnapshotListSchema,
  projectSnapshotSchema,
  type ProjectSnapshot,
} from "@/domain/project";
import { getTimelineEvents, type TimelineEvent } from "@/lib/projectStats";

interface ProjectListResponse {
  ok: true;
  projects: unknown;
}

interface ProjectResponse {
  ok: true;
  project: unknown;
}

interface TimelineResponse {
  ok: true;
  events: TimelineEvent[];
}

export type ProjectDataSource = "api" | "mock";

export const fallbackProjectSnapshots = projectSnapshotListSchema.parse(mockProjects);
export const fallbackTimelineEvents = getTimelineEvents(fallbackProjectSnapshots);

async function readJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function listProjectSnapshots(signal?: AbortSignal): Promise<{
  projects: ProjectSnapshot[];
  source: ProjectDataSource;
}> {
  try {
    const payload = await readJson<ProjectListResponse>("/api/projects", signal);
    return {
      projects: projectSnapshotListSchema.parse(payload.projects),
      source: "api",
    };
  } catch {
    return {
      projects: fallbackProjectSnapshots,
      source: "mock",
    };
  }
}

export async function readProjectSnapshot(
  slug: string,
  signal?: AbortSignal,
): Promise<{
  project: ProjectSnapshot | null;
  source: ProjectDataSource;
}> {
  try {
    const payload = await readJson<ProjectResponse>(
      `/api/projects/${encodeURIComponent(slug)}`,
      signal,
    );
    return {
      project: projectSnapshotSchema.parse(payload.project),
      source: "api",
    };
  } catch {
    return {
      project:
        fallbackProjectSnapshots.find(
          (project) => project.slug === slug || project.id === slug,
        ) ?? null,
      source: "mock",
    };
  }
}

export async function listProtocolTimeline(signal?: AbortSignal): Promise<{
  events: TimelineEvent[];
  source: ProjectDataSource;
}> {
  try {
    const payload = await readJson<TimelineResponse>("/api/timeline", signal);
    return {
      events: payload.events,
      source: "api",
    };
  } catch {
    return {
      events: fallbackTimelineEvents,
      source: "mock",
    };
  }
}
