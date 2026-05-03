import type { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { HomeSidebarCard } from "./HomeSidebarCard";

interface SiteStatusItem {
  label: string;
  value: string;
}

interface SiteStatusCardProps {
  icon: LucideIcon;
  title: string;
  items: SiteStatusItem[];
  checkedAtLabel: string;
}

export function SiteStatusCard({
  icon,
  title,
  items,
  checkedAtLabel,
}: SiteStatusCardProps) {
  return (
    <HomeSidebarCard icon={icon} title={title}>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{item.label}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {item.value}
            </span>
          </div>
        ))}
        <Separator className="mt-4" />
        <div className="pt-1 text-[11px] text-muted-foreground">
          {checkedAtLabel}
        </div>
      </div>
    </HomeSidebarCard>
  );
}
