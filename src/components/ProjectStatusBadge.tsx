import { Badge } from "@/components/ui/badge";
import { projectStatusMeta, type ProjectStatus } from "@/domain/project";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ProjectStatus,
  { label: string; icon: string; className: string }
> = {
  idea: {
    label: projectStatusMeta.idea.label,
    icon: projectStatusMeta.idea.icon,
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-transparent",
  },
  prototype: {
    label: projectStatusMeta.prototype.label,
    icon: projectStatusMeta.prototype.icon,
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80 border-transparent",
  },
  mvp: {
    label: projectStatusMeta.mvp.label,
    icon: projectStatusMeta.mvp.icon,
    className: "bg-lime-100 text-lime-800 hover:bg-lime-100/80 border-transparent",
  },
  live: {
    label: projectStatusMeta.live.label,
    icon: projectStatusMeta.live.icon,
    className: "bg-green-100 text-green-800 hover:bg-green-100/80 border-transparent",
  },
  mature: {
    label: projectStatusMeta.mature.label,
    icon: projectStatusMeta.mature.icon,
    className: "bg-teal-100 text-teal-800 hover:bg-teal-100/80 border-transparent",
  },
  paused: {
    label: projectStatusMeta.paused.label,
    icon: projectStatusMeta.paused.icon,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-transparent",
  },
  archived: {
    label: projectStatusMeta.archived.label,
    icon: projectStatusMeta.archived.icon,
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
