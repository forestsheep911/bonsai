import { Link } from "react-router-dom";
import { ProjectCard } from "@/components/ProjectCard";
import { useProjectList } from "@/hooks/useProjectData";
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
  Coffee
} from "lucide-react";

export function Home() {
  const { data: projects } = useProjectList();

  // Categorize projects for the lanes
  const cultivating = projects.filter(p => ["idea", "prototype", "mvp"].includes(p.status));
  const highlighted = projects.filter(p => ["live", "mature"].includes(p.status));
  const archived = projects.filter(p => ["paused", "archived"].includes(p.status));

  const allCount = projects.length;
  const prototypeCount = cultivating.length;
  const archivedCount = archived.length;

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

  return (
    <div className="space-y-10">
      {/* 顶部个人叙事区 Hero */}
      <section className="grid gap-8 rounded-xl border bg-card p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-stretch lg:p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl underline decoration-primary/30 underline-offset-[6px] decoration-4">
              我的项目盆景园
            </h1>
            <p className="max-w-[500px] text-base leading-relaxed text-muted-foreground pt-2">
              把正在做、已经上线、暂停和归档的小项目放在一起，记录它们的生长、变化与思考。
            </p>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">持续迭代</p>
                <p className="text-muted-foreground">小步快跑，长期主义</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">真实进展</p>
                <p className="text-muted-foreground">记录过程，不只结果</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                <Share2 className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">开源分享</p>
                <p className="text-muted-foreground">知识沉淀，互相启发</p>
              </div>
            </div>
          </div>
        </div>

        {/* 园丁信息卡 */}
        <div className="flex flex-col justify-between rounded-lg bg-[#fdfdfc] border border-border/50 p-5 w-full md:w-[340px]">
          <div className="flex items-center gap-4">
            <img 
              src="https://github.com/shadcn.png" 
              alt="Forest" 
              className="h-14 w-14 rounded-full border shadow-sm"
            />
            <div>
              <h3 className="font-bold text-foreground">园丁 Forest</h3>
              <p className="text-xs text-muted-foreground mt-0.5">独立开发者 · 构建中 · 长期主义者</p>
            </div>
          </div>
          
          <div className="mt-5 rounded-md bg-secondary/50 px-4 py-3 text-sm text-foreground/80 border border-border/30">
            在 AI 时代，做一点有用又有趣的东西。
          </div>
          
          <div className="mt-5 flex items-center justify-between px-2 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">{allCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">项目总数</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div>
              <p className="text-lg font-bold text-foreground">{highlighted.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">运行中</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div>
              <p className="text-lg font-bold text-foreground">{prototypeCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">原型中</p>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div>
              <p className="text-lg font-bold text-foreground">{archivedCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">归档</p>
            </div>
          </div>
        </div>
      </section>

      {/* 主体两栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* 左侧：项目索引泳道 */}
        <div className="space-y-8">
          
          {/* 正在培育 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <Sprout className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">正在培育</h2>
                <span className="hidden sm:inline-block text-sm text-muted-foreground ml-2">探索方向中，快速迭代，寻找产品市场匹配。</span>
              </div>
              <Link to="/overview?filter=cultivating" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                查看全部 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cultivating.slice(0, 4).map(project => (
                <ProjectCard key={project.id} project={project} variant="grid" />
              ))}
            </div>
          </section>

          {/* 优选项目 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-foreground">优选项目</h2>
                <span className="hidden sm:inline-block text-sm text-muted-foreground ml-2">稳定运行，有实际用户价值的项目。</span>
              </div>
              <Link to="/overview?filter=highlighted" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                查看全部 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {highlighted.slice(0, 6).map(project => (
                <ProjectCard key={project.id} project={project} variant="grid" />
              ))}
            </div>
          </section>

          {/* 近期归档 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <Archive className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-bold text-foreground">近期归档</h2>
                <span className="hidden sm:inline-block text-sm text-muted-foreground ml-2">阶段性完成或暂停归档的项目。</span>
              </div>
              <Link to="/overview?filter=archived" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                查看全部 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {archived.slice(0, 4).map(project => (
                <ProjectCard key={project.id} project={project} variant="grid" />
              ))}
            </div>
          </section>

        </div>

        {/* 右侧：全局动态区 */}
        <div className="space-y-6">
          
          {/* 最近更新 */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="bg-muted/20 p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                最近更新
              </h3>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="p-5 space-y-4">
              {recentUpdates.slice(0, 5).map((update, i) => (
                <div key={i} className="flex gap-3 text-sm group">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary/40 mt-1.5 group-hover:bg-primary transition-colors" />
                    {i !== 4 && <div className="w-px h-full bg-border/50 mt-1" />}
                  </div>
                  <div className="pb-3 flex-1">
                    <Link to={`/projects/${update.projectSlug}`} className="block">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-medium text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                          {update.projectName}
                        </p>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">
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
                <Link to="/timeline" className="text-xs text-primary hover:underline flex items-center gap-1">
                  查看全部更新 <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* 园丁笔记 */}
          <div className="rounded-xl border bg-[#fbfbf9] text-card-foreground shadow-sm overflow-hidden relative">
            <div className="p-4 border-b flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">园丁笔记</h3>
            </div>
            <div className="p-5 pb-16">
              <p className="text-sm leading-loose text-muted-foreground">
                把想法种下，观察它们如何生长。有些会成为作品，有些会教会我取舍。记录这些过程，是为了更好地出发。
              </p>
              <div className="mt-4">
                <Link to="/log" className="text-xs text-primary hover:underline flex items-center gap-1">
                  查看更多笔记 <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
            {/* 装饰插画 */}
            <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none translate-x-4 translate-y-2">
              <Coffee className="h-24 w-24 text-stone-600" strokeWidth={1} />
            </div>
          </div>

          {/* 站点状态 */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">站点状态</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">系统</span>
                <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> 运行中</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">数据</span>
                <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> 同步中</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">部署</span>
                <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> 正常</span>
              </div>
              <div className="pt-2 border-t text-[11px] text-muted-foreground">
                最后检查: 刚刚
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
