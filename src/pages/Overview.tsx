import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  FolderKanban,
  Sprout,
  Trees,
} from "lucide-react";
import { mockProjects } from "@/data/mock";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRecentProjects, getStatusCounts, getTimelineEvents } from "@/lib/projectStats";

export function Overview() {
  const statusCounts = getStatusCounts(mockProjects);
  const recentProjects = getRecentProjects(mockProjects, 3);
  const recentEvents = getTimelineEvents(mockProjects).slice(0, 3);
  const activeCount =
    (statusCounts.prototype ?? 0) +
    (statusCounts.mvp ?? 0) +
    (statusCounts.live ?? 0) +
    (statusCounts.mature ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-10">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-sm text-muted-foreground">
            <Sprout className="h-4 w-4 text-green-700" />
            AI 时代独立开发者的项目盆景园
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              我的项目盆景园
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              把想法、原型、MVP、正在运行的小工具和已经休眠的项目放在一个地方，
              持续记录它们从种子到成型的过程。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/projects">
              <Button className="gap-2 bg-green-700 text-white shadow-sm hover:bg-green-800">
                进入项目园
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/timeline">
              <Button variant="outline" className="gap-2">
                查看培育日志
                <CalendarDays className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-green-900/10 bg-[#fdfdfb] shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-900/10 text-green-800">
                <Trees className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">当前状态</div>
                <div className="text-2xl font-bold">{mockProjects.length} 盆项目</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border bg-background p-3">
                <div className="text-xl font-bold">{activeCount}</div>
                <div className="text-xs text-muted-foreground">培育中</div>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <div className="text-xl font-bold">{statusCounts.live ?? 0}</div>
                <div className="text-xs text-muted-foreground">已上线</div>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <div className="text-xl font-bold">{recentEvents.length}</div>
                <div className="text-xs text-muted-foreground">近期事件</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium">最近活跃项目</div>
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{project.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{project.summary}</div>
                  </div>
                  <ProjectStatusBadge status={project.status} className="ml-3 shrink-0" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/projects">
          <Card className="h-full transition-colors hover:bg-muted/30">
            <CardContent className="space-y-3 p-5">
              <FolderKanban className="h-5 w-5 text-green-700" />
              <div className="font-semibold">项目 Dashboard</div>
              <p className="text-sm text-muted-foreground">
                搜索、筛选和查看所有项目状态。
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/timeline">
          <Card className="h-full transition-colors hover:bg-muted/30">
            <CardContent className="space-y-3 p-5">
              <CalendarDays className="h-5 w-5 text-green-700" />
              <div className="font-semibold">培育日志</div>
              <p className="text-sm text-muted-foreground">
                按时间回看项目状态变化和里程碑。
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin">
          <Card className="h-full transition-colors hover:bg-muted/30">
            <CardContent className="space-y-3 p-5">
              <Trees className="h-5 w-5 text-green-700" />
              <div className="font-semibold">后台工作台</div>
              <p className="text-sm text-muted-foreground">
                快速新建项目，维护项目故事和状态。
              </p>
            </CardContent>
          </Card>
        </Link>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">最近培育记录</h2>
          <Link to="/timeline" className="text-sm text-green-700 hover:underline">
            查看全部
          </Link>
        </div>
        <div className="grid gap-3">
          {recentEvents.map((event) => (
            <Link
              key={event.id}
              to={`/projects/${event.projectSlug}`}
              className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <div>
                <div className="font-medium">{event.projectName}</div>
                <div className="text-sm text-muted-foreground">{event.title}</div>
              </div>
              <Badge variant="outline" className="ml-3 shrink-0">
                {new Date(event.occurredAt).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
