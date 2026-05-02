import type { Project } from "@/types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { Card } from "@/components/ui/card";
import { CalendarDays, Code, ExternalLink, GitCommitHorizontal, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { projectStatusMeta } from "@/domain/project";

interface ProjectCardProps {
  project: Project;
  variant?: "grid" | "list";
}

export function ProjectCard({ project, variant = "grid" }: ProjectCardProps) {
  const githubLink = project.links.find((link) => link.type === "github");
  const websiteLink = project.links.find((link) => link.type === "website");
  const demoLink = project.links.find((link) => link.type === "demo");
  const latestMilestone = [...project.milestones].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )[0];
  const statusDescription = projectStatusMeta[project.status].description;
  const formattedDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(project.updatedAt));
  const formattedMilestoneDate = latestMilestone
    ? new Intl.DateTimeFormat("zh-CN", {
        month: "short",
        day: "numeric",
      }).format(new Date(latestMilestone.occurredAt))
    : null;

  if (variant === "list") {
    return (
      <Card className="group overflow-hidden border-muted-foreground/20 bg-card transition-all duration-200 hover:border-foreground/30 hover:shadow-md">
        <div className="grid gap-0 sm:grid-cols-[11rem_1fr]">
          <Link
            to={`/projects/${project.slug}`}
            className="relative flex h-32 items-center justify-center overflow-hidden border-b bg-muted/40 sm:h-full sm:border-b-0 sm:border-r"
          >
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="text-5xl font-bold text-muted-foreground/20">
                {project.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="absolute right-3 top-3 shadow-sm">
              <ProjectStatusBadge status={project.status} />
            </div>
          </Link>

          <div className="flex min-w-0 flex-col gap-3 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <Link to={`/projects/${project.slug}`}>
                  <h3 className="line-clamp-1 text-lg font-semibold leading-tight transition-colors hover:text-green-700">
                    {project.name}
                  </h3>
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {project.summary}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {formattedDate}
              </div>
            </div>

            <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
              <div className="flex items-start gap-2">
                <GitCommitHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                <div className="min-w-0">
                  <div className="line-clamp-1 font-medium">
                    {latestMilestone?.title ?? statusDescription}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {latestMilestone
                      ? `${formattedMilestoneDate} · ${projectStatusMeta[project.status].label}`
                      : projectStatusMeta[project.status].label}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                {githubLink && (
                  <a href={githubLink.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="GitHub">
                    <Code className="w-4 h-4" />
                  </a>
                )}
                {websiteLink && (
                  <a href={websiteLink.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="官网">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {demoLink && (
                  <a href={demoLink.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" title="在线演示">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-muted-foreground/20 bg-card transition-all duration-200 hover:border-green-900/30 hover:shadow-md">
      <div className="flex flex-col h-full">
        {/* 封面图区域 */}
        {project.coverImage ? (
          <Link to={`/projects/${project.slug}`} className="h-36 overflow-hidden relative border-b block">
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* 状态徽章浮于图片右上角 */}
            <div className="absolute top-3 right-3 shadow-sm z-10">
              <ProjectStatusBadge status={project.status} />
            </div>
          </Link>
        ) : (
          <Link to={`/projects/${project.slug}`} className="h-36 bg-muted/40 flex items-center justify-center border-b relative block group-hover:bg-muted/60 transition-colors">
            <span className="text-5xl font-bold text-muted-foreground/20 transition-transform duration-500 group-hover:scale-110">
              {project.name.charAt(0).toUpperCase()}
            </span>
            <div className="absolute top-3 right-3 shadow-sm z-10">
              <ProjectStatusBadge status={project.status} />
            </div>
          </Link>
        )}

        <div className="p-4 flex flex-col flex-grow">
          {/* 标题 */}
          <div className="mb-2 space-y-1.5">
            <Link to={`/projects/${project.slug}`}>
              <h3 className="font-semibold text-lg leading-tight hover:text-green-700 transition-colors line-clamp-1 inline-block">
                {project.name}
              </h3>
            </Link>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {statusDescription}
            </p>
          </div>

          {/* 简介 */}
          <p className="mb-3 line-clamp-2 flex-grow text-sm text-muted-foreground">
            {project.summary}
          </p>

          <div className="mb-4 rounded-lg border bg-muted/20 px-3 py-2 text-sm">
            <div className="flex items-start gap-2">
              <GitCommitHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
              <div className="min-w-0">
                <div className="line-clamp-1 font-medium">
                  {latestMilestone?.title ?? "暂无里程碑记录"}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {latestMilestone
                    ? `${formattedMilestoneDate} · 最近进展`
                    : "等待项目首次上报"}
                </div>
              </div>
            </div>
          </div>

          {/* 底部元信息 */}
          <div className="flex items-center justify-between text-muted-foreground mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              {githubLink && (
                <a
                  href={githubLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  title="GitHub"
                >
                  <Code className="w-4 h-4" />
                </a>
              )}
              {websiteLink && (
                <a
                  href={websiteLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  title="官网"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {demoLink && (
                <a
                  href={demoLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                  title="在线演示"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="text-[11px] font-medium tracking-wide">更新于 {formattedDate}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
