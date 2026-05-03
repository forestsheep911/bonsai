import { homeProjectLanes, type HomeProjectLaneKey } from "@/config/home";
import type { Project } from "@/types";

const statLaneLabels: Record<HomeProjectLaneKey, string> = {
  cultivating: "原型中",
  highlighted: "运行中",
  archived: "归档",
};

export function useHomeViewModel(projects: Project[]) {
  const laneProjects = homeProjectLanes.map((lane) => ({
    ...lane,
    projects: projects.filter((project) =>
      lane.statuses.includes(project.status),
    ),
  }));

  const laneCounts = Object.fromEntries(
    laneProjects.map((lane) => [lane.key, lane.projects.length]),
  ) as Record<HomeProjectLaneKey, number>;

  const gardenerStats = [
    { label: "项目总数", value: projects.length },
    { label: statLaneLabels.highlighted, value: laneCounts.highlighted },
    { label: statLaneLabels.cultivating, value: laneCounts.cultivating },
    { label: statLaneLabels.archived, value: laneCounts.archived },
  ];

  const recentUpdates = projects
    .flatMap((project) =>
      project.milestones.map((milestone) => ({
        ...milestone,
        projectName: project.name,
        projectSlug: project.slug,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );

  return {
    gardenerStats,
    laneProjects,
    recentUpdates,
  };
}
