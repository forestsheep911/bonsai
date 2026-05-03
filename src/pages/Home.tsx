import { GardenerNoteCard } from "@/components/home/GardenerNoteCard";
import { HomeHero } from "@/components/home/HomeHero";
import { ProjectLane } from "@/components/home/ProjectLane";
import { RecentUpdatesCard } from "@/components/home/RecentUpdatesCard";
import { SiteStatusCard } from "@/components/home/SiteStatusCard";
import {
  gardenerNote,
  homeFeatures,
  homeHero,
  siteStatus,
} from "@/config/home";
import { useHomeViewModel } from "@/hooks/useHomeViewModel";
import { useProjectList } from "@/hooks/useProjectData";

export function Home() {
  const { data: projects } = useProjectList();
  const { gardenerStats, laneProjects, recentUpdates } =
    useHomeViewModel(projects);

  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
      <div className="w-full min-w-0 space-y-8">
        <HomeHero
          hero={homeHero}
          features={homeFeatures}
          stats={gardenerStats}
        />

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
