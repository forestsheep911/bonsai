import type { Project, ProjectMilestone, ProjectStatus } from "@/domain/project";

export interface TimelineEvent extends ProjectMilestone {
  projectId: string;
  projectName: string;
  projectSlug: string;
}

export function getStatusCounts(projects: Project[]) {
  return projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] ?? 0) + 1;
    return acc;
  }, {} as Record<ProjectStatus, number>);
}

export function getTimelineEvents(projects: Project[]) {
  return projects
    .flatMap((project) =>
      project.milestones.map((milestone) => ({
        ...milestone,
        projectId: project.id,
        projectName: project.name,
        projectSlug: project.slug,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );
}

export function getRecentProjects(projects: Project[], limit = 3) {
  return [...projects]
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}
