import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkTo: string;
}

export function HomeSectionHeader({
  icon: Icon,
  title,
  description,
  linkTo,
}: HomeSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-primary" />
        <h2 className="shrink-0 text-lg font-bold text-foreground">{title}</h2>
        <span className="ml-2 hidden truncate text-sm text-muted-foreground sm:inline-block">
          {description}
        </span>
      </div>
      <Button asChild variant="link" size="sm" className="ml-4 shrink-0 px-0">
        <Link to={linkTo}>
          查看全部 <ArrowRight className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}
