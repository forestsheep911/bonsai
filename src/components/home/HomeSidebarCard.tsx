import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface HomeSidebarCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function HomeSidebarCard({
  icon: Icon,
  title,
  children,
  className,
  headerAction,
}: HomeSidebarCardProps) {
  return (
    <Card className={`min-w-0 overflow-hidden shadow-sm ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b p-4">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{title}</h3>
        {headerAction && <div className="ml-auto">{headerAction}</div>}
      </CardHeader>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}
