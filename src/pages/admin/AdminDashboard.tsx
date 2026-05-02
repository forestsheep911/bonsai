import { Link } from "react-router-dom";
import {
  CalendarDays,
  FilePlus2,
  FolderKanban,
  PencilLine,
  Sprout,
} from "lucide-react";
import { mockProjects } from "@/data/mock";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentProjects, getStatusCounts, getTimelineEvents } from "@/lib/projectStats";

export function AdminDashboard() {
  const statusCounts = getStatusCounts(mockProjects);
  const recentProjects = getRecentProjects(mockProjects, 5);
  const recentEvents = getTimelineEvents(mockProjects).slice(0, 4);

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">工作台概览</h1>
          <p className="text-muted-foreground">
            管理项目状态、故事、链接和最近培育记录。
          </p>
        </div>
        <Link to="/admin/projects/new">
          <Button className="gap-2 bg-green-700 text-white hover:bg-green-800">
            <FilePlus2 className="h-4 w-4" />
            新建项目
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <FolderKanban className="h-8 w-8 text-green-700" />
            <div>
              <div className="text-2xl font-bold">{mockProjects.length}</div>
              <div className="text-sm text-muted-foreground">全部项目</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <Sprout className="h-8 w-8 text-green-700" />
            <div>
              <div className="text-2xl font-bold">
                {(statusCounts.prototype ?? 0) + (statusCounts.mvp ?? 0)}
              </div>
              <div className="text-sm text-muted-foreground">正在培育</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <CalendarDays className="h-8 w-8 text-green-700" />
            <div>
              <div className="text-2xl font-bold">{recentEvents.length}</div>
              <div className="text-sm text-muted-foreground">近期事件</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <PencilLine className="h-8 w-8 text-green-700" />
            <div>
              <div className="text-2xl font-bold">{statusCounts.live ?? 0}</div>
              <div className="text-sm text-muted-foreground">线上运行</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">最近更新项目</CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="truncate font-medium">{project.name}</div>
                  <div className="truncate text-sm text-muted-foreground">
                    {project.summary}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <ProjectStatusBadge status={project.status} />
                  <Link to={`/admin/projects/${project.slug}`}>
                    <Button variant="outline" size="sm">
                      编辑
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">最近培育日志</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                to={`/projects/${event.projectSlug}`}
                className="block rounded-lg border px-3 py-2 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{event.projectName}</div>
                    <div className="truncate text-sm text-muted-foreground">
                      {event.title}
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {new Date(event.occurredAt).toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
