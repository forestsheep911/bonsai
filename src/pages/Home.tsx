import { useState } from "react";
import { Link } from "react-router-dom";
import { ProjectCard } from "@/components/ProjectCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowDown, ArrowUp, LayoutGrid, List, Activity, CalendarDays } from "lucide-react";
import { projectStatusMeta, type ProjectStatus } from "@/domain/project";
import { useProjectList } from "@/hooks/useProjectData";

export function Home() {
  const { data: projects } = useProjectList();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Calculate status statistics
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<ProjectStatus, number>);

  const allCount = projects.length;
  const recentUpdates = projects
    .flatMap((project) =>
      project.milestones.map((milestone) => ({
        ...milestone,
        projectName: project.name,
        projectSlug: project.slug,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );
  const activeCount = projects.filter((project) =>
    ["prototype", "mvp", "live", "mature"].includes(project.status),
  ).length;
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags)),
  ).sort((a, b) => a.localeCompare(b, "zh-CN"));

  const filteredProjects = projects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (tagFilter !== "all" && !p.tags.includes(tagFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.summary.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();
    return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 个人介绍区 */}
      <section className="grid gap-6 rounded-xl border bg-[#fdfdfb] p-5 shadow-sm md:grid-cols-[auto_1fr] md:items-center md:p-6">
        <Avatar className="h-24 w-24 border-2 border-muted shadow-sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="Developer" />
          <AvatarFallback>Dev</AvatarFallback>
        </Avatar>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                独立开发者 / 产品工匠
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
                把想法当作种子，用代码培育有生命力的产品。这里记录每个项目现在的状态、最近进展和可访问入口。
              </p>
            </div>
            <div className="flex gap-2 pt-1 flex-wrap">
              <Badge variant="secondary" className="font-normal text-xs bg-green-900/10 text-green-800 hover:bg-green-900/20 dark:text-green-400 dark:bg-green-400/10 dark:hover:bg-green-400/20 border-transparent">全栈开发</Badge>
              <Badge variant="secondary" className="font-normal text-xs bg-green-900/10 text-green-800 hover:bg-green-900/20 dark:text-green-400 dark:bg-green-400/10 dark:hover:bg-green-400/20 border-transparent">UI/UX 设计</Badge>
              <Badge variant="secondary" className="font-normal text-xs bg-green-900/10 text-green-800 hover:bg-green-900/20 dark:text-green-400 dark:bg-green-400/10 dark:hover:bg-green-400/20 border-transparent">效率工具</Badge>
              <Badge variant="secondary" className="font-normal text-xs bg-green-900/10 text-green-800 hover:bg-green-900/20 dark:text-green-400 dark:bg-green-400/10 dark:hover:bg-green-400/20 border-transparent">独立黑客</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border bg-background px-4 py-3">
              <div className="text-xl font-bold">{allCount}</div>
              <div className="mt-1 text-xs text-muted-foreground">项目</div>
            </div>
            <div className="rounded-lg border bg-background px-4 py-3">
              <div className="text-xl font-bold">{activeCount}</div>
              <div className="mt-1 text-xs text-muted-foreground">培育中</div>
            </div>
            <div className="rounded-lg border bg-background px-4 py-3">
              <div className="text-xl font-bold">{recentUpdates.length}</div>
              <div className="mt-1 text-xs text-muted-foreground">记录</div>
            </div>
          </div>
        </div>
      </section>

      {/* 页面主干区 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 左侧项目列表 (占据 3 列) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* 状态统计条 & 筛选工具栏 */}
          <div className="space-y-4">
            <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full">
              <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50 justify-start overflow-x-auto no-scrollbar">
                <TabsTrigger value="all" className="rounded-sm px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  全部 <span className="ml-1.5 text-xs text-muted-foreground">{allCount}</span>
                </TabsTrigger>
                {(Object.entries(projectStatusMeta) as [ProjectStatus, typeof projectStatusMeta[ProjectStatus]][]).map(([status, meta]) => {
                  const count = statusCounts[status] || 0;
                  if (count === 0) return null;
                  return (
                    <TabsTrigger key={status} value={status} className="rounded-sm px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <span className="mr-1.5">{meta.icon}</span> {meta.label}
                      <span className="ml-1.5 text-xs text-muted-foreground">{count}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="搜索项目名称、简介或标签..." 
                  className="pl-9 h-9 bg-background focus-visible:ring-1 focus-visible:ring-green-700/50" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 xl:pb-0">
                <Button
                  variant={tagFilter === "all" ? "secondary" : "outline"}
                  size="sm"
                  className="h-8 shrink-0 text-xs"
                  onClick={() => setTagFilter("all")}
                >
                  全部标签
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={tagFilter === tag ? "secondary" : "outline"}
                    size="sm"
                    className="h-8 shrink-0 text-xs"
                    onClick={() => setTagFilter(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2 xl:ml-auto xl:justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 text-muted-foreground border-dashed"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                >
                  {sortOrder === "desc" ? <ArrowDown className="h-4 w-4 mr-2" /> : <ArrowUp className="h-4 w-4 mr-2" />}
                  按更新时间
                </Button>
                <div className="flex h-9 items-center rounded-md border bg-background p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-7 w-7"
                    aria-label="网格视图"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-7 w-7"
                    aria-label="列表视图"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 项目网格 */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-5" : "grid grid-cols-1 gap-4"}>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} variant={viewMode} />
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                没有找到匹配状态和搜索条件的项目。
              </div>
            )}
          </div>
        </div>

        {/* 右侧边栏：最近更新 (占据 1 列) */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="bg-muted/30 p-4 border-b">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                最近更新
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {recentUpdates
                .slice(0, 5)
                .map((update, i, arr) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-border mt-1.5" />
                      {i !== arr.length - 1 && <div className="w-px h-full bg-border/50 mt-1" />}
                    </div>
                    <div className="pb-3 flex-1">
                      <Link to={`/projects/${update.projectSlug}`} className="block group">
                        <p className="font-medium text-foreground leading-tight group-hover:text-green-700 transition-colors line-clamp-1">
                          {update.projectName}
                        </p>
                        <p className="text-muted-foreground mt-0.5 line-clamp-2">
                          {update.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">
                          {new Date(update.occurredAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
                        </p>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="rounded-xl border border-dashed bg-[#fdfdfc] p-5 text-sm text-muted-foreground dark:bg-muted/10">
            <div className="flex items-start gap-3">
              <Activity className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
              <p>状态优先展示：每个项目都保留当前阶段、最近进展和可访问链接。</p>
            </div>
            {recentUpdates[0] && (
              <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs">
                <CalendarDays className="h-3.5 w-3.5" />
                最近一次更新：
                {new Date(recentUpdates[0].occurredAt).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
