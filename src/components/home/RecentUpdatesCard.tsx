import { Link } from "react-router-dom";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RecentUpdate {
  id: string;
  title: string;
  occurredAt: string;
  projectName: string;
  projectSlug: string;
}

interface RecentUpdatesCardProps {
  updates: RecentUpdate[];
}

export function RecentUpdatesCard({ updates }: RecentUpdatesCardProps) {
  return (
    <Card className="min-w-0 overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-muted/20 p-4">
        <h3 className="text-sm font-semibold">最近更新</h3>
        <Activity className="h-4 w-4 shrink-0 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {updates.slice(0, 5).map((update, index) => (
          <div key={update.id} className="group flex min-w-0 gap-3 text-sm">
            <div className="flex shrink-0 flex-col items-center">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary/40 transition-colors group-hover:bg-primary" />
              {index !== 4 && <div className="mt-1 h-full w-px bg-border/50" />}
            </div>
            <div className="min-w-0 flex-1 pb-3">
              <Link
                to={`/projects/${update.projectSlug}`}
                className="block min-w-0"
              >
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <p className="truncate font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
                    {update.projectName}
                  </p>
                  <span className="shrink-0 whitespace-nowrap text-[11px] text-muted-foreground">
                    {new Date(update.occurredAt).toLocaleDateString("zh-CN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {update.title}
                </p>
              </Link>
            </div>
          </div>
        ))}
        <div className="pt-2">
          <Button asChild variant="link" size="sm" className="h-auto px-0 text-xs">
            <Link to="/timeline">
              查看全部更新 <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
