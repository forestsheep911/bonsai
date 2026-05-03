import type { LucideIcon } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/types";
import { HomeSectionHeader } from "./HomeSectionHeader";

interface ProjectLaneProps {
  icon: LucideIcon;
  title: string;
  description: string;
  filterKey: string;
  projects: Project[];
  limit?: number;
}

export function ProjectLane({
  icon,
  title,
  description,
  filterKey,
  projects,
  limit = 4,
}: ProjectLaneProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="min-w-0 space-y-3">
      <HomeSectionHeader
        icon={icon}
        title={title}
        description={description}
        linkTo={`/overview?filter=${filterKey}`}
      />
      <Separator className="mb-4 bg-border/60" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {projects.slice(0, limit).map((project) => (
          <ProjectCard key={project.id} project={project} variant="grid" />
        ))}
      </div>
    </section>
  );
}
