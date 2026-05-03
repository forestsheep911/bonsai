import { Link, Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BarChart3,
  ChevronRight,
  Code,
  ExternalLink,
  Globe,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Tag,
  ArrowUpRight,
  GitCommitHorizontal,
  Activity
} from "lucide-react";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { projectStatusMeta, type ProjectLink, type ProjectMetric } from "@/domain/project";
import { useProjectSnapshot } from "@/hooks/useProjectData";

const linkIcon = (type: ProjectLink["type"]) => {
  if (type === "github") return <Code className="w-4 h-4" />;
  if (type === "demo") return <Globe className="w-4 h-4" />;
  return <ExternalLink className="w-4 h-4" />;
};

const metricIcon = (key: ProjectMetric["key"]) => {
  if (key === "users" || key === "dau") return <Users className="w-4 h-4" />;
  if (key === "mrr") return <TrendingUp className="w-4 h-4" />;
  if (key === "stars") return <Star className="w-4 h-4" />;
  return <BarChart3 className="w-4 h-4" />;
};

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProjectSnapshot(id);

  if (!project && !isLoading) {
    return <Navigate to="/" replace />;
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-6xl pb-12 text-sm text-muted-foreground">
        正在同步项目数据...
      </div>
    );
  }

  const projectEvents = [...project.milestones].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
  const latestEvent = projectEvents[0];

  const formattedDate = (dateString: string) =>
    new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateString));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* 导航路径 */}
      <nav className="flex items-center text-sm text-muted-foreground font-medium">
        <Link to="/" className="hover:text-green-700 transition-colors">
          项目园
        </Link>
        <ChevronRight className="w-4 h-4 mx-1.5 opacity-50" />
        <span className="text-foreground">{project.name}</span>
      </nav>

      {/* 标题与摘要区 */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                {project.name}
              </h1>
              <ProjectStatusBadge
                status={project.status}
                className="text-sm px-3 py-1 shadow-sm"
              />
            </div>
            <p className="text-xl text-muted-foreground/90 leading-relaxed font-medium">
              {project.summary}
            </p>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-lg border bg-muted/20 px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  当前阶段
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {projectStatusMeta[project.status].description}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/20 px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <GitCommitHorizontal className="h-3.5 w-3.5" />
                  最近进展
                </div>
                <div className="mt-1 line-clamp-1 text-sm font-semibold">
                  {latestEvent?.title ?? "等待项目首次上报"}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/20 px-3 py-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  更新时间
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {formattedDate(project.updatedAt)}
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧核心动作 */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
             {project.links.filter(l => l.type === 'demo' || l.type === 'website').slice(0, 1).map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-700 text-primary-foreground hover:bg-green-800 h-10 px-4 py-2 shadow-sm"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  访问 {link.label}
                </a>
             ))}
             {project.links.filter(l => l.type === 'github').slice(0, 1).map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  <Code className="mr-2 h-4 w-4" />
                  {link.label}
                </a>
             ))}
          </div>
        </div>
      </div>

      {/* 封面区 - 产品预览感 */}
      {project.coverImage && (
        <div className="rounded-xl overflow-hidden border bg-muted/10 shadow-lg ring-1 ring-border/50">
          <div className="bg-muted/50 border-b px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
            <div className="ml-2 text-xs text-muted-foreground font-medium">{project.slug}.bonsai.local</div>
          </div>
          <div className="bg-background">
            <img
              src={project.coverImage}
              alt={`${project.name} preview`}
              className="w-full object-cover max-h-[500px] hover:scale-[1.01] transition-transform duration-700"
            />
          </div>
        </div>
      )}

      {/* 主体两栏内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 左侧主要内容：项目故事与文档 */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                项目故事
              </h2>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground/90 leading-loose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.story || "暂无详细故事。"}
              </ReactMarkdown>
            </div>
          </section>

          {/* 底部元信息 */}
          <div className="rounded-lg bg-muted/30 p-6 flex flex-wrap gap-y-4 gap-x-8 text-sm text-muted-foreground mt-8 border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>创建于 {formattedDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>更新于 {formattedDate(project.updatedAt)}</span>
            </div>
            {project.tags.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Tag className="w-4 h-4" />
                <div className="flex gap-1.5 flex-wrap">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-normal text-xs bg-background shadow-sm border-muted-foreground/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-6">
          
          {/* 相关链接卡片 */}
          {project.links.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <CardTitle className="text-base font-semibold">相关链接</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-sm">
                {project.links.map((link) => (
                  <a
                    key={`${link.type}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-md hover:bg-muted transition-colors group font-medium text-foreground/80 hover:text-foreground"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-background rounded-md shadow-sm border border-border/50 group-hover:border-border transition-colors">
                        {linkIcon(link.type)}
                      </div>
                      {link.label}
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 核心数据卡片 */}
          {project.metrics.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <CardTitle className="text-base font-semibold">核心数据</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-1">
                {project.metrics.map((metric, index) => (
                  <div key={metric.key}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <div className="p-1.5 bg-background rounded-md shadow-sm border border-border/50">
                          {metricIcon(metric.key)}
                        </div>
                        {metric.label}
                      </div>
                      <div className="font-bold text-foreground text-base tracking-tight">
                        {metric.unit ?? ""}
                        {metric.value.toLocaleString()}
                      </div>
                    </div>
                    {index < project.metrics.length - 1 && <Separator className="bg-muted/60" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 培育日志卡片 */}
          {projectEvents.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <CardTitle className="text-base font-semibold">培育日志</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-6 pl-2 border-l-[1.5px] border-muted relative mt-2">
                  {projectEvents.map((event) => (
                    <div key={event.id} className="relative pl-5">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-[1.5px] border-green-500 bg-background ring-4 ring-background" />
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-medium text-muted-foreground/80 tracking-wide uppercase">
                          {formattedDate(event.occurredAt)}
                        </span>
                        <span className="font-semibold text-sm text-foreground">
                          {event.title}
                        </span>
                        {event.description && (
                          <span className="text-sm text-muted-foreground/90 leading-snug">
                            {event.description}
                          </span>
                        )}
                        {event.type === "status_change" &&
                          event.fromStatus &&
                          event.toStatus && (
                            <div className="flex items-center gap-2 mt-2 bg-muted/30 w-fit p-1.5 rounded-md border border-border/50">
                              <ProjectStatusBadge
                                status={event.fromStatus}
                                showIcon={false}
                                className="text-[10px] px-1.5 h-5 shadow-none"
                              />
                              <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                              <ProjectStatusBadge
                                status={event.toStatus}
                                showIcon={false}
                                className="text-[10px] px-1.5 h-5 shadow-none"
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
