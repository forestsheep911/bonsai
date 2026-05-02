import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ProjectStatus,
  { label: string; icon: string; className: string }
> = {
  idea: {
    label: "种子",
    icon: "🌱",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-transparent",
  },
  prototype: {
    label: "嫩芽",
    icon: "🌿",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-transparent",
  },
  mvp: {
    label: "幼苗",
    icon: "🪴",
    className: "bg-lime-100 text-lime-800 hover:bg-lime-100/80 border-transparent",
  },
  live: {
    label: "成型",
    icon: "🌳",
    className: "bg-green-100 text-green-800 hover:bg-green-100/80 border-transparent",
  },
  mature: {
    label: "老桩",
    icon: "🎋",
    className: "bg-teal-100 text-teal-800 hover:bg-teal-100/80 border-transparent",
  },
  paused: {
    label: "休眠",
    icon: "💤",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-transparent",
  },
  archived: {
    label: "入库",
    icon: "📦",
    className: "bg-stone-100 text-stone-800 hover:bg-stone-100/80 border-transparent",
  },
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
  showIcon?: boolean;
}

export function ProjectStatusBadge({
  status,
  className,
  showIcon = true,
}: ProjectStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.idea;

  return (
    <Badge
      variant="outline"
      className={cn("px-2 py-0.5 whitespace-nowrap font-medium", config.className, className)}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
