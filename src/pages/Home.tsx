import { FeaturePill } from "@/components/home/FeaturePill";
import { GardenerCard } from "@/components/home/GardenerCard";
import { GardenerNoteCard } from "@/components/home/GardenerNoteCard";
import { ProjectLane } from "@/components/home/ProjectLane";
import { RecentUpdatesCard } from "@/components/home/RecentUpdatesCard";
import { SiteStatusCard } from "@/components/home/SiteStatusCard";
import { Card } from "@/components/ui/card";
import {
  gardenerNote,
  homeFeatures,
  homeHero,
  homeProjectLanes,
  siteStatus,
} from "@/config/home";
import { useProjectList } from "@/hooks/useProjectData";

export function Home() {
  const { data: projects } = useProjectList();

  const laneProjects = homeProjectLanes.map((lane) => ({
    ...lane,
    projects: projects.filter((project) =>
      lane.statuses.includes(project.status),
    ),
  }));

  const cultivatingCount =
    laneProjects.find((lane) => lane.key === "cultivating")?.projects.length ??
    0;
  const highlightedCount =
    laneProjects.find((lane) => lane.key === "highlighted")?.projects.length ??
    0;
  const archivedCount =
    laneProjects.find((lane) => lane.key === "archived")?.projects.length ?? 0;

  const gardenerStats = [
    { label: "项目总数", value: projects.length },
    { label: "运行中", value: highlightedCount },
    { label: "原型中", value: cultivatingCount },
    { label: "归档", value: archivedCount },
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

  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
      <div className="w-full min-w-0 space-y-8">
        <Card className="min-w-0 overflow-hidden border-border bg-[#fdfdfc] shadow-sm">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-stretch lg:p-8">
            <div className="min-w-0 space-y-6">
              <div className="min-w-0 space-y-2">
                <h1 className="break-words text-3xl font-bold tracking-tight text-foreground underline decoration-primary/30 decoration-4 underline-offset-[6px] sm:text-4xl">
                  {homeHero.title}
                </h1>
                <p className="max-w-[480px] break-words pt-2 text-base leading-relaxed text-muted-foreground">
                  {homeHero.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 pt-2">
                {homeFeatures.map((feature) => (
                  <FeaturePill key={feature.title} {...feature} />
                ))}
              </div>
            </div>

            <GardenerCard stats={gardenerStats} />
          </div>
        </Card>

        {laneProjects.map((lane) => (
          <ProjectLane
            key={lane.key}
            icon={lane.icon}
            title={lane.title}
            description={lane.description}
            filterKey={lane.key}
            projects={lane.projects}
            limit={lane.limit}
          />
        ))}
      </div>

      <div className="min-w-0 shrink-0 space-y-6">
        <RecentUpdatesCard updates={recentUpdates} />
        <GardenerNoteCard {...gardenerNote} />
        <SiteStatusCard {...siteStatus} />
      </div>
    </div>
  );
}
