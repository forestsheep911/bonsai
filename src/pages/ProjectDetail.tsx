import { useParams, Link, Navigate } from "react-router-dom";
import { mockProjects, mockEvents } from "@/data/mock";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Code, ExternalLink, ChevronRight, Users, TrendingUp, Star, CircleDot } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = mockProjects.find((p) => p.id === id);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  // 筛选属于该项目的时间线事件（按时间倒序排列，最新的在前）
  const projectEvents = mockEvents
    .filter((e) => e.projectId === project.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formattedDate = (dateString: string) =>
    new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateString));

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">项目</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-foreground">{project.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧主要内容区 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 标题头部 */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-extrabold tracking-tight">{project.name}</h1>
              <ProjectStatusBadge status={project.status} className="text-sm px-3 py-1" />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* 大封面 */}
          {project.coverImage && (
            <div className="rounded-xl overflow-hidden border bg-muted/20">
              <img
                src={project.coverImage}
                alt={`${project.name} cover`}
                className="w-full object-cover max-h-[400px]"
              />
            </div>
          )}

          {/* 项目故事 (Markdown 渲染) */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">项目故事</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.story}
              </ReactMarkdown>
            </div>
          </section>

          {/* 元信息底部 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-6 border-t">
            <div>创建于 {formattedDate(project.createdAt)}</div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div>最后更新 {formattedDate(project.updatedAt)}</div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-2">
              标签：
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧侧边栏 */}
        <div className="space-y-6">
          {/* 链接卡片 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">相关链接</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {project.links.website && (
                <a href={project.links.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors group">
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> 官网</div>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {project.links.demo && (
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors group">
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> 演示站 (Demo)</div>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {project.links.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors group">
                  <div className="flex items-center gap-2"><Code className="w-4 h-4" /> GitHub 仓库</div>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {project.links.docs && (
                <a href={project.links.docs} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors group">
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> 文档</div>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </CardContent>
          </Card>

          {/* 数据指标卡片 */}
          {project.metrics && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">核心数据</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.metrics.users !== undefined && (
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /> 活跃用户</div>
                    <div className="font-semibold">{project.metrics.users.toLocaleString()}</div>
                  </div>
                )}
                {project.metrics.mrr !== undefined && (
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="w-4 h-4" /> 月收入 (MRR)</div>
                    <div className="font-semibold">¥{project.metrics.mrr.toLocaleString()}</div>
                  </div>
                )}
                {project.metrics.stars !== undefined && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground"><Star className="w-4 h-4" /> 收藏 (Stars)</div>
                    <div className="font-semibold">{project.metrics.stars.toLocaleString()}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 简易里程碑时间线 */}
          {projectEvents.length > 0 && (
             <Card>
               <CardHeader className="pb-3">
                 <CardTitle className="text-lg">培育日志</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4 pl-2 border-l-2 border-muted relative">
                    {projectEvents.map((event) => (
                      <div key={event.id} className="relative pl-4">
                        <CircleDot className="w-4 h-4 absolute -left-[26px] top-1 text-muted-foreground bg-background" />
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            {formattedDate(event.date)}
                          </span>
                          <span className="font-medium text-sm">{event.title}</span>
                          {event.description && (
                            <span className="text-xs text-muted-foreground">{event.description}</span>
                          )}
                          {event.type === 'status_change' && event.fromStatus && event.toStatus && (
                            <div className="flex items-center gap-2 mt-1">
                              <ProjectStatusBadge status={event.fromStatus} showIcon={false} className="text-[10px] px-1 h-5" />
                              <span className="text-muted-foreground text-xs">➔</span>
                              <ProjectStatusBadge status={event.toStatus} showIcon={false} className="text-[10px] px-1 h-5" />
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
