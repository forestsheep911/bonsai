import { useMemo } from "react";
import { Link } from "react-router-dom";
import { mockProjects } from "@/data/mock";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, CalendarDays, Lightbulb, Sprout, TreesIcon, Archive } from "lucide-react";
import type { ProjectMilestone } from "@/domain/project";

interface EnhancedMilestone extends ProjectMilestone {
  projectId: string;
  projectName: string;
  projectSlug: string;
}

export function Timeline() {
  // 从所有项目中提取并增强 milestone
  const allEvents = useMemo(() => {
    const events: EnhancedMilestone[] = [];
    mockProjects.forEach((project) => {
      project.milestones.forEach((m) => {
        events.push({
          ...m,
          projectId: project.id,
          projectName: project.name,
          projectSlug: project.slug,
        });
      });
    });

    // 按时间倒序排序
    return events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }, []);

  // 按月份分组
  const groupedEvents = useMemo(() => {
    const groups: Record<string, EnhancedMilestone[]> = {};
    allEvents.forEach((event) => {
      const date = new Date(event.occurredAt);
      const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      groups[yearMonth].push(event);
    });
    return groups;
  }, [allEvents]);

  // 计算顶部概览统计
  const stats = useMemo(() => {
    return {
      idea: mockProjects.filter((p) => p.status === "idea").length,
      prototypeOrSeedling: mockProjects.filter((p) => ["prototype", "mvp"].includes(p.status)).length,
      liveOrMature: mockProjects.filter((p) => ["live", "mature"].includes(p.status)).length,
      archived: mockProjects.filter((p) => ["paused", "archived"].includes(p.status)).length,
    };
  }, []);

  const formattedDate = (dateString: string) =>
    new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateString));

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* 头部与统计 */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-green-700" />
            全站时间线
          </h1>
          <p className="text-muted-foreground mt-2">个人开发者的盆景培育日志。</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-muted/10 shadow-sm border-dashed">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-1 text-center">
              <Lightbulb className="w-5 h-5 text-amber-500 mb-1" />
              <div className="text-2xl font-bold">{stats.idea}</div>
              <div className="text-xs text-muted-foreground">想法阶段</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/10 shadow-sm border-dashed">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-1 text-center">
              <Sprout className="w-5 h-5 text-green-500 mb-1" />
              <div className="text-2xl font-bold">{stats.prototypeOrSeedling}</div>
              <div className="text-xs text-muted-foreground">原型 / 幼苗</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/10 shadow-sm border-dashed">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-1 text-center">
              <TreesIcon className="w-5 h-5 text-green-700 mb-1" />
              <div className="text-2xl font-bold">{stats.liveOrMature}</div>
              <div className="text-xs text-muted-foreground">成型 / 上线</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/10 shadow-sm border-dashed">
            <CardContent className="p-4 flex flex-col items-center justify-center gap-1 text-center">
              <Archive className="w-5 h-5 text-muted-foreground mb-1" />
              <div className="text-2xl font-bold">{stats.archived}</div>
              <div className="text-xs text-muted-foreground">休眠 / 归档</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 筛选占位 */}
      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
        <Button variant="outline" size="sm" className="h-8 text-xs border-dashed">
          <Filter className="w-3 h-3 mr-2" />
          状态筛选 (全部)
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs border-dashed">
          <Filter className="w-3 h-3 mr-2" />
          事件类型 (全部)
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs border-dashed">
          <Filter className="w-3 h-3 mr-2" />
          标签筛选 (全部)
        </Button>
      </div>

      {/* 时间线事件流 */}
      <div className="space-y-10">
        {Object.entries(groupedEvents).map(([month, events]) => (
          <div key={month} className="space-y-4">
            <h2 className="text-xl font-semibold sticky top-14 bg-background/95 backdrop-blur py-2 z-10">
              {month}
            </h2>
            <div className="space-y-6 pl-4 border-l-2 border-green-700/20 ml-2 relative">
              {events.map((event) => (
                <div key={event.id} className="relative pl-6">
                  {/* 时间节点指示器 */}
                  <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full border-2 border-green-600 bg-background ring-4 ring-background shadow-sm" />
                  
                  <Card className="shadow-sm hover:shadow transition-shadow">
                    <CardHeader className="p-4 pb-2 flex-row justify-between items-start gap-4 space-y-0 bg-muted/5 border-b">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
                          <span className="text-foreground/80 bg-muted/50 px-2 py-0.5 rounded-md border">
                            {formattedDate(event.occurredAt)}
                          </span>
                          <span className="text-xs bg-green-900/10 text-green-800 dark:text-green-400 dark:bg-green-400/10 px-2 py-0.5 rounded-md">
                            {event.type}
                          </span>
                        </div>
                        <CardTitle className="text-base leading-tight">
                          {event.title}
                        </CardTitle>
                      </div>
                      <Link to={`/projects/${event.projectSlug}`} className="text-sm font-semibold hover:text-green-700 hover:underline shrink-0">
                        {event.projectName}
                      </Link>
                    </CardHeader>
                    {(event.description || (event.type === "status_change" && event.fromStatus && event.toStatus)) && (
                      <CardContent className="p-4 pt-3 space-y-2">
                        {event.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        )}
                        {event.type === "status_change" && event.fromStatus && event.toStatus && (
                          <div className="flex items-center gap-2 bg-muted/30 w-fit p-1.5 rounded-md border border-border/50">
                            <ProjectStatusBadge
                              status={event.fromStatus}
                              showIcon={true}
                              className="text-xs px-2 h-6 shadow-none bg-background"
                            />
                            <span className="text-muted-foreground/60 text-xs">➔</span>
                            <ProjectStatusBadge
                              status={event.toStatus}
                              showIcon={true}
                              className="text-xs px-2 h-6 shadow-none bg-background"
                            />
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
        {allEvents.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            暂无培育日志。
          </div>
        )}
      </div>
    </div>
  );
}
