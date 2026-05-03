import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatStrip } from "./StatStrip";

interface GardenerCardProps {
  stats: Array<{
    label: string;
    value: number;
  }>;
}

export function GardenerCard({ stats }: GardenerCardProps) {
  return (
    <div className="flex w-full min-w-0 shrink-0 flex-col justify-between rounded-lg border border-border/50 bg-card/50 p-5 md:w-[320px]">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="h-14 w-14 border shadow-sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="Forest" />
          <AvatarFallback>F</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-foreground">园丁 Forest</h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            独立开发者 · 长期主义者
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-border/30 bg-secondary/40 px-4 py-3 text-sm text-foreground/80">
        在 AI 时代，做一点有用又有趣的东西。
      </div>

      <StatStrip items={stats} />
    </div>
  );
}
