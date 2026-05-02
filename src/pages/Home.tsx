import { mockProjects } from "@/data/mock";
import { ProjectCard } from "@/components/ProjectCard";

export function Home() {
  return (
    <div className="space-y-8">
      {/* 页面标题区 */}
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">独立开发者 · 持续造物中</h1>
        <p className="text-muted-foreground text-lg">
          用代码与想法，培育有生命力的产品。
        </p>
      </section>

      {/* 项目列表区 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">所有项目</h2>
          <div className="text-sm text-muted-foreground">
            共 {mockProjects.length} 盆
          </div>
        </div>
        
        {/* 响应式网格布局：手机单列，平板两列，桌面三列 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
