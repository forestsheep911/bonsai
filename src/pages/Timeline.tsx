import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, CalendarDays, Lightbulb, ListFilter, Sprout, TreesIcon } from "lucide-react";
import { useProjectList, useTimelineEvents } from "@/hooks/useProjectData";
import type { TimelineEvent } from "@/lib/projectStats";

export function Timeline() {
  const { data: projects } = useProjectList();
  const { data: allEvents } = useTimelineEvents();
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");

  const eventTypes = useMemo(
    () => Array.from(new Set(allEvents.map((event) => event.type))).sort(),
    [allEvents],
  );

  const filteredEvents = useMemo(() => {
    if (eventTypeFilter === "all") return allEvents;
    return allEvents.filter((event) => event.type === eventTypeFilter);
  }, [allEvents, eventTypeFilter]);

  // 按月份分组
  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    filteredEvents.forEach((event) => {
      const date = new Date(event.occurredAt);
      const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      groups[yearMonth].push(event);
    });
    return groups;
  }, [filteredEvents]);

  // 计算顶部概览统计
  const stats = useMemo(() => {
    return {
      idea: projects.filter((p) => p.status === "idea").length,
      prototypeOrSeedling: projects.filter((p) => ["prototype", "mvp"].includes(p.status)).length,
      liveOrMature: projects.filter((p) => ["live", "mature"].includes(p.status)).length,
      archived: projects.filter((p) => ["paused", "archived"].includes(p.status)).length,
    };
  }, [projects]);

  const formattedDate = (dateString: string) =>
    new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateString));

  const latestEvent = allEvents[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* 头部与统计 */}
      <div className="space-y-6">
        <div className="rounded-xl border bg-[#fdfdfb] p-5 shadow-sm">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <CalendarDays className="w-8 h-8 text-green-700" />
            全站时间线
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            个人开发者的培育日志，按时间记录项目状态变化、上线、复盘和阶段性进展。
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-md border bg-background px-2.5 py-1">
              {allEvents.length} 条记录
            </span>
            {latestEvent && (
              <span className="rounded-md border bg-background px-2.5 py-1">
                最近更新 {formattedDate(latestEvent.occurredAt)}
              </span>
            )}
          </div>
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

      <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-4">
        <div className="mr-1 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <ListFilter className="h-4 w-4" />
          事件类型
        </div>
        <Button
          variant={eventTypeFilter === "all" ? "secondary" : "outline"}
          size="sm"
          className="h-8 text-xs"
          onClick={() => setEventTypeFilter("all")}
        >
          全部 {allEvents.length}
        </Button>
        {eventTypes.map((eventType) => {
          const count = allEvents.filter((event) => event.type === eventType).length;
          return (
            <Button
              key={eventType}
              variant={eventTypeFilter === eventType ? "secondary" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setEventTypeFilter(eventType)}
            >
              {eventType} {count}
            </Button>
          );
        })}
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
        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            暂无培育日志。
          </div>
        )}
      </div>
    </div>
  );
}
