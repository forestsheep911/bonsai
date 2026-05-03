import type { LucideIcon } from "lucide-react";

export type FeatureTone = "primary" | "secondary";

interface FeaturePillProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: FeatureTone;
}

export function FeaturePill({
  icon: Icon,
  title,
  description,
  tone = "secondary",
}: FeaturePillProps) {
  const iconClassName =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : "bg-secondary text-foreground";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
