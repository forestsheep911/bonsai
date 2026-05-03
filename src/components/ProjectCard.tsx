import type { Project } from "@/types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectCardProps {
  project: Project;
  variant?: "grid" | "list"; // Keeping variant for compatibility, but focusing on grid
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "刚刚更新";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} 分钟前更新`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} 小时前更新`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} 天前更新`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} 个月前更新`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} 年前更新`;
}

export function ProjectCard({ project, variant = "grid" }: ProjectCardProps) {
  const timeAgo = formatTimeAgo(project.updatedAt);

  if (variant === "list") {
    return (
      <Card className="flex w-full min-w-0 max-w-full flex-row overflow-hidden transition-shadow hover:shadow">
        <Link to={`/projects/${project.slug}`} className="w-48 bg-muted/30 border-r block shrink-0">
          {project.coverImage && (
            <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover" />
          )}
        </Link>
        <CardContent className="p-4 flex min-w-0 flex-1 flex-col">
          <Link to={`/projects/${project.slug}`} className="truncate font-bold transition-colors hover:text-primary">{project.name}</Link>
          <p className="mt-1 truncate text-sm text-muted-foreground">{project.summary}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group flex h-full w-full min-w-0 max-w-full flex-col overflow-hidden transition-all duration-200 hover:border-border hover:shadow-md">
      {/* 封面图区域 */}
      <Link to={`/projects/${project.slug}`} className="relative h-40 w-full overflow-hidden border-b bg-muted/20 block shrink-0">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center bg-muted/30 transition-transform duration-500 group-hover:scale-105">
            <span className="text-4xl font-bold text-muted-foreground/20">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Link>

      <CardContent className="flex flex-col flex-1 p-5 min-w-0">
        {/* 标题和状态 */}
        <div className="mb-3 space-y-1.5 min-w-0">
          <Link to={`/projects/${project.slug}`} className="block min-w-0">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate">
              {project.name}
            </h3>
          </Link>
          <ProjectStatusBadge status={project.status} showIcon={false} />
        </div>

        {/* 简介 */}
        <p className="line-clamp-2 text-sm text-muted-foreground/90 leading-relaxed flex-1 min-w-0">
          {project.summary}
        </p>

        {/* 底部区：时间和动作 */}
        <div className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-4">
          <span className="text-xs text-muted-foreground/80 truncate min-w-0">{timeAgo}</span>
          <Button asChild variant="secondary" size="sm" className="shrink-0">
            <Link to={`/projects/${project.slug}`}>
              进入 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
