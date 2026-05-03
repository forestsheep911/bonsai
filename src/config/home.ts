import {
  Archive,
  BookOpen,
  FileText,
  Leaf,
  Server,
  Share2,
  Sprout,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { ProjectStatus } from "@/domain/project";
import type { FeatureTone } from "@/components/home/FeaturePill";

interface HomeFeatureConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: FeatureTone;
}

export type HomeProjectLaneKey = "cultivating" | "highlighted" | "archived";

interface HomeProjectLaneConfig {
  key: HomeProjectLaneKey;
  icon: LucideIcon;
  title: string;
  description: string;
  statuses: ProjectStatus[];
  limit: number;
}

export const homeHero = {
  title: "我的项目盆景园",
  description:
    "把正在做、已经上线、暂停和归档的小项目放在一起，记录它们的生长、变化与思考。",
};

export const homeFeatures: HomeFeatureConfig[] = [
  {
    icon: Leaf,
    title: "持续迭代",
    description: "小步快跑，长期主义",
    tone: "primary",
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

export const homeProjectLanes: HomeProjectLaneConfig[] = [
  {
    key: "cultivating",
    icon: Sprout,
    title: "正在培育",
    description: "探索方向中，快速迭代，寻找产品市场匹配。",
    statuses: ["idea", "prototype", "mvp"],
    limit: 4,
  },
  {
    key: "highlighted",
    icon: Star,
    title: "优选项目",
    description: "稳定运行，有实际用户价值的项目。",
    statuses: ["live", "mature"],
    limit: 6,
  },
  {
    key: "archived",
    icon: Archive,
    title: "近期归档",
    description: "阶段性完成或暂停归档的项目。",
    statuses: ["paused", "archived"],
    limit: 4,
  },
];

export const gardenerNote = {
  icon: FileText,
  title: "园丁笔记",
  body: "把想法种下，观察它们如何生长。有些会成为作品，有些会教会我取舍。记录这些过程，是为了更好地出发。",
  linkTo: "/log",
  linkLabel: "查看更多笔记",
};

export const siteStatus = {
  icon: Server,
  title: "站点状态",
  items: [
    { label: "系统", value: "运行中" },
    { label: "数据", value: "同步中" },
    { label: "部署", value: "正常" },
  ],
  checkedAtLabel: "最后检查: 刚刚",
};
