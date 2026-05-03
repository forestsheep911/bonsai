import { Link } from "react-router-dom";
import {
  Archive,
  ArrowRight,
  BookOpen,
  Coffee,
  FileText,
  Leaf,
  Server,
  Share2,
  Sprout,
  Star,
} from "lucide-react";
import { FeaturePill } from "@/components/home/FeaturePill";
import { GardenerCard } from "@/components/home/GardenerCard";
import { HomeSidebarCard } from "@/components/home/HomeSidebarCard";
import { ProjectLane } from "@/components/home/ProjectLane";
import { RecentUpdatesCard } from "@/components/home/RecentUpdatesCard";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProjectList } from "@/hooks/useProjectData";

const featurePills = [
  {
    icon: Leaf,
    title: "持续迭代",
    description: "小步快跑，长期主义",
    tone: "primary" as const,
  },
  {
    icon: BookOpen,
    title: "真实进展",
    description: "记录过程，不只结果",
  },
  {
    icon: Share2,
    title: "开源分享",
    description: "知识沉淀，互相启发",
  },
];

export function Home() {
  const { data: projects } = useProjectList();

  const cultivating = projects.filter((project) =>
    ["idea", "prototype", "mvp"].includes(project.status),
  );
  const highlighted = projects.filter((project) =>
    ["live", "mature"].includes(project.status),
  );
  const archived = projects.filter((project) =>
    ["paused", "archived"].includes(project.status),
  );

  const gardenerStats = [
    { label: "项目总数", value: projects.length },
    { label: "运行中", value: highlighted.length },
    { label: "原型中", value: cultivating.length },
    { label: "归档", value: archived.length },
  ];

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
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
      <div className="w-full min-w-0 space-y-8">
        <Card className="min-w-0 overflow-hidden border-border bg-[#fdfdfc] shadow-sm">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-stretch lg:p-8">
            <div className="min-w-0 space-y-6">
              <div className="min-w-0 space-y-2">
                <h1 className="break-words text-3xl font-bold tracking-tight text-foreground underline decoration-primary/30 decoration-4 underline-offset-[6px] sm:text-4xl">
                  我的项目盆景园
                </h1>
                <p className="max-w-[480px] break-words pt-2 text-base leading-relaxed text-muted-foreground">
                  把正在做、已经上线、暂停和归档的小项目放在一起，记录它们的生长、变化与思考。
                </p>
              </div>
              <div className="flex flex-wrap gap-5 pt-2">
                {featurePills.map((feature) => (
                  <FeaturePill key={feature.title} {...feature} />
                ))}
              </div>
            </div>

            <GardenerCard stats={gardenerStats} />
          </div>
        </Card>

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

      <div className="min-w-0 shrink-0 space-y-6">
        <RecentUpdatesCard updates={recentUpdates} />

        <HomeSidebarCard
          icon={FileText}
          title="园丁笔记"
          className="relative bg-[#fbfbf9]"
        >
          <div className="pb-11">
            <p className="break-words text-sm leading-loose text-muted-foreground">
              把想法种下，观察它们如何生长。有些会成为作品，有些会教会我取舍。记录这些过程，是为了更好地出发。
            </p>
            <div className="mt-4">
              <Link
                to="/log"
                className="flex w-max items-center gap-1 text-xs text-primary hover:underline"
              >
                查看更多笔记 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 translate-x-4 translate-y-2 opacity-20">
            <Coffee className="h-24 w-24 text-stone-600" strokeWidth={1} />
          </div>
        </HomeSidebarCard>

        <HomeSidebarCard icon={Server} title="站点状态">
          <div className="space-y-4">
            {[
              ["系统", "运行中"],
              ["数据", "同步中"],
              ["部署", "正常"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{label}</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {value}
                </span>
              </div>
            ))}
            <Separator className="mt-4" />
            <div className="pt-1 text-[11px] text-muted-foreground">
              最后检查: 刚刚
            </div>
          </div>
        </HomeSidebarCard>
      </div>
    </div>
  );
}
