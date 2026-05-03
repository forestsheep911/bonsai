import { Link } from "react-router-dom";
import { ProjectCard } from "@/components/ProjectCard";
import { useProjectList } from "@/hooks/useProjectData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/types";
import { 
  Leaf, 
  BookOpen, 
  Share2, 
  Sprout, 
  Star, 
  Archive, 
  Activity, 
  FileText, 
  Server,
  ArrowRight,
  Coffee,
  type LucideIcon
} from "lucide-react";

// --- Sub-components for Home Page ---

function SectionHeader({ icon: Icon, title, description, linkTo }: { icon: LucideIcon, title: string, description: string, linkTo: string }) {
  return (
    <div className="flex items-center justify-between pb-3">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className="h-5 w-5 shrink-0 text-primary" />
        <h2 className="text-lg font-bold text-foreground shrink-0">{title}</h2>
        <span className="hidden sm:inline-block text-sm text-muted-foreground ml-2 truncate">
          {description}
        </span>
      </div>
      <Link 
        to={linkTo} 
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors shrink-0 ml-4"
      >
        查看全部 <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function ProjectLane({ 
  icon, 
  title, 
  description, 
  filterKey, 
  projects, 
  limit = 4 
}: { 
  icon: LucideIcon, 
  title: string, 
  description: string, 
  filterKey: string, 
  projects: Project[], 
  limit?: number 
}) {
  if (projects.length === 0) return null;
  return (
    <section className="space-y-3 min-w-0">
      <SectionHeader icon={icon} title={title} description={description} linkTo={`/overview?filter=${filterKey}`} />
      <Separator className="mb-4 bg-border/60" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.slice(0, limit).map(project => (
          <ProjectCard key={project.id} project={project} variant="grid" />
        ))}
      </div>
    </section>
  );
}

function StatStrip({ all, active, prototype, archived }: { all: number, active: number, prototype: number, archived: number }) {
  return (
    <div className="mt-5 grid grid-cols-4 divide-x divide-border text-center">
      <div className="px-1 min-w-0">
        <p className="text-lg font-bold text-foreground truncate">{all}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">项目总数</p>
      </div>
      <div className="px-1 min-w-0">
        <p className="text-lg font-bold text-foreground truncate">{active}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">运行中</p>
      </div>
      <div className="px-1 min-w-0">
        <p className="text-lg font-bold text-foreground truncate">{prototype}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">原型中</p>
      </div>
      <div className="px-1 min-w-0">
        <p className="text-lg font-bold text-foreground truncate">{archived}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">归档</p>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export function Home() {
  const { data: projects } = useProjectList();

  // Categorize projects for the lanes
  const cultivating = projects.filter(p => ["idea", "prototype", "mvp"].includes(p.status));
  const highlighted = projects.filter(p => ["live", "mature"].includes(p.status));
  const archived = projects.filter(p => ["paused", "archived"].includes(p.status));

  const recentUpdates = projects
    .flatMap((project) =>
      project.milestones.map((milestone) => ({
        ...milestone,
        projectName: project.name,
        projectSlug: project.slug,
      })),
    )
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start w-full min-w-0">
      {/* 左侧主干区：包含叙事区与项目泳道 */}
      <div className="space-y-8 min-w-0 w-full">
        
        {/* 顶部个人叙事区 Hero */}
        <Card className="shadow-sm border-border bg-[#fdfdfc] overflow-hidden min-w-0">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-stretch lg:p-8">
            <div className="space-y-6 min-w-0">
              <div className="space-y-2 min-w-0">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl underline decoration-primary/30 underline-offset-[6px] decoration-4 break-words">
                  我的项目盆景园
                </h1>
                <p className="max-w-[480px] text-base leading-relaxed text-muted-foreground pt-2 break-words">
                  把正在做、已经上线、暂停和归档的小项目放在一起，记录它们的生长、变化与思考。
                </p>
              </div>
              <div className="flex flex-wrap gap-5 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">持续迭代</p>
                    <p className="text-muted-foreground text-xs mt-0.5">小步快跑，长期主义</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">真实进展</p>
                    <p className="text-muted-foreground text-xs mt-0.5">记录过程，不只结果</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">开源分享</p>
                    <p className="text-muted-foreground text-xs mt-0.5">知识沉淀，互相启发</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 园丁信息卡 */}
            <div className="flex flex-col justify-between rounded-lg bg-card/50 border border-border/50 p-5 w-full md:w-[320px] shrink-0 min-w-0">
              <div className="flex items-center gap-4 min-w-0">
                <img 
                  src="https://github.com/shadcn.png" 
                  alt="Forest" 
                  className="h-14 w-14 rounded-full border shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground truncate">园丁 Forest</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">独立开发者 · 长期主义者</p>
                </div>
              </div>
              
              <div className="mt-5 rounded-md bg-secondary/40 px-4 py-3 text-sm text-foreground/80 border border-border/30">
                在 AI 时代，做一点有用又有趣的东西。
              </div>
              
              <StatStrip 
                all={projects.length} 
                active={highlighted.length} 
                prototype={cultivating.length} 
                archived={archived.length} 
              />
            </div>
          </div>
        </Card>
        
        {/* 项目泳道 */}
        <ProjectLane 
          icon={Sprout} 
          title="正在培育" 
          description="探索方向中，快速迭代，寻找产品市场匹配。" 
          filterKey="cultivating" 
          projects={cultivating} 
          limit={4} 
        />
        
        <ProjectLane 
          icon={Star} 
          title="优选项目" 
          description="稳定运行，有实际用户价值的项目。" 
          filterKey="highlighted" 
          projects={highlighted} 
          limit={6} 
        />
        
        <ProjectLane 
          icon={Archive} 
          title="近期归档" 
          description="阶段性完成或暂停归档的项目。" 
          filterKey="archived" 
          projects={archived} 
          limit={4} 
        />

      </div>

      {/* 右侧：全局动态区 */}
      <div className="space-y-6 shrink-0 min-w-0">
        
        {/* 最近更新 */}
        <Card className="shadow-sm overflow-hidden min-w-0">
          <CardHeader className="bg-muted/20 p-4 border-b flex flex-row items-center justify-between space-y-0">
            <h3 className="font-semibold text-sm">最近更新</h3>
            <Activity className="h-4 w-4 text-primary shrink-0" />
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {recentUpdates.slice(0, 5).map((update, i) => (
              <div key={i} className="flex gap-3 text-sm group min-w-0">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary/40 mt-1.5 group-hover:bg-primary transition-colors shrink-0" />
                  {i !== 4 && <div className="w-px h-full bg-border/50 mt-1" />}
                </div>
                <div className="pb-3 flex-1 min-w-0">
                  <Link to={`/projects/${update.projectSlug}`} className="block min-w-0">
                    <div className="flex justify-between items-start gap-2 min-w-0">
                      <p className="font-medium text-foreground leading-tight group-hover:text-primary transition-colors truncate">
                        {update.projectName}
                      </p>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                        {new Date(update.occurredAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                      {update.title}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Link to="/timeline" className="text-xs text-primary hover:underline flex items-center gap-1 w-max">
                查看全部更新 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 园丁笔记 */}
        <Card className="shadow-sm overflow-hidden relative bg-[#fbfbf9] min-w-0">
          <CardHeader className="p-4 border-b flex flex-row items-center gap-2 space-y-0">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="font-semibold text-sm">园丁笔记</h3>
          </CardHeader>
          <CardContent className="p-5 pb-16">
            <p className="text-sm leading-loose text-muted-foreground break-words">
              把想法种下，观察它们如何生长。有些会成为作品，有些会教会我取舍。记录这些过程，是为了更好地出发。
            </p>
            <div className="mt-4">
              <Link to="/log" className="text-xs text-primary hover:underline flex items-center gap-1 w-max">
                查看更多笔记 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
          {/* 装饰插画 */}
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none translate-x-4 translate-y-2">
            <Coffee className="h-24 w-24 text-stone-600" strokeWidth={1} />
          </div>
        </Card>

        {/* 站点状态 */}
        <Card className="shadow-sm overflow-hidden min-w-0">
          <CardHeader className="p-4 border-b flex flex-row items-center gap-2 space-y-0">
            <Server className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="font-semibold text-sm">站点状态</h3>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">系统</span>
              <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></div> 运行中</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">数据</span>
              <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></div> 同步中</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">部署</span>
              <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></div> 正常</span>
            </div>
            <Separator className="mt-4" />
            <div className="pt-1 text-[11px] text-muted-foreground">
              最后检查: 刚刚
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
