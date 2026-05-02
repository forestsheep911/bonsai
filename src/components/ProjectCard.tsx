import type { Project } from "@/types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Code, Globe, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formattedDate = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(project.updatedAt));

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
      {/* 封面图区域 */}
      {project.coverImage ? (
        <Link to={`/project/${project.id}`} className="h-48 overflow-hidden block">
          <img
            src={project.coverImage}
            alt={project.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      ) : (
        <Link to={`/project/${project.id}`} className="h-48 bg-muted flex items-center justify-center border-b block text-center pt-16">
          {/* 这里可以放一个占位图标或图案，现在暂用项目名称首字母 */}
          <span className="text-4xl font-bold text-muted-foreground/30">
            {project.name.charAt(0).toUpperCase()}
          </span>
        </Link>
      )}

      <CardHeader className="p-4 pb-2 flex-row justify-between items-start space-y-0 gap-4">
        <div className="flex flex-col gap-1">
          <Link to={`/project/${project.id}`} className="font-bold text-lg leading-tight line-clamp-1 hover:underline">
            {project.name}
          </Link>
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <ProjectStatusBadge status={project.status} />
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.shortDescription}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center text-muted-foreground border-t mt-4 pt-4">
        <div className="flex items-center gap-3">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              title="GitHub"
            >
              <Code className="w-4 h-4" />
            </a>
          )}
          {project.links.website && (
            <a
              href={project.links.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              title="官网"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              title="在线演示"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        <div className="text-xs">更新于 {formattedDate}</div>
      </CardFooter>
    </Card>
  );
}
