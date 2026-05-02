import type {
  ProjectReport,
  ProjectSnapshot,
  TimelineEvent,
} from "./projectProtocol.js";
import {
  listProjectSnapshots,
  listTimelineEvents,
  previewProjectReport,
  readProjectSnapshot,
} from "./projectStore.js";

export interface ProjectRepository {
  listProjects(): Promise<ProjectSnapshot[]>;
  readProject(slug: string): Promise<ProjectSnapshot | null>;
  listTimelineEvents(): Promise<TimelineEvent[]>;
  previewReport(report: ProjectReport): Promise<ProjectSnapshot | null>;
}

class MemoryProjectRepository implements ProjectRepository {
  async listProjects() {
    return listProjectSnapshots();
  }

  async readProject(slug: string) {
    return readProjectSnapshot(slug);
  }

  async listTimelineEvents() {
    return listTimelineEvents();
  }

  async previewReport(report: ProjectReport) {
    return previewProjectReport(report);
  }
}

const memoryProjectRepository = new MemoryProjectRepository();

export function getProjectRepository(): ProjectRepository {
  return memoryProjectRepository;
}
