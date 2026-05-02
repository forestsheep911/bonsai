import type { Project } from "@/types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { Card } from "@/components/ui/card";
import { Code, Globe, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const githubLink = project.links.find((link) => link.type === "github");
  const websiteLink = project.links.find((link) => link.type === "website");
  const demoLink = project.links.find((link) => link.type === "demo");
  const formattedDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(project.updatedAt));

  return (
    <Card className="group flex flex-col h-full overflow-hidden hover:shadow-md transition-all duration-200 border-muted-foreground/20 hover:border-foreground/30 bg-card">
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
          <div className="mb-2">
            <Link to={`/projects/${project.slug}`}>
              <h3 className="font-semibold text-lg leading-tight hover:text-green-700 transition-colors line-clamp-1 inline-block">
                {project.name}
              </h3>
            </Link>
          </div>

          {/* 简介 */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-grow mb-4">
            {project.summary}
          </p>

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
