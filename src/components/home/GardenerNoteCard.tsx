import { Link } from "react-router-dom";
import { ArrowRight, Coffee, type LucideIcon } from "lucide-react";
import { HomeSidebarCard } from "./HomeSidebarCard";

interface GardenerNoteCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  linkTo: string;
  linkLabel: string;
}

export function GardenerNoteCard({
  icon,
  title,
  body,
  linkTo,
  linkLabel,
}: GardenerNoteCardProps) {
  return (
    <HomeSidebarCard icon={icon} title={title} className="relative bg-[#fbfbf9]">
      <div className="pb-11">
        <p className="break-words text-sm leading-loose text-muted-foreground">
          {body}
        </p>
        <div className="mt-4">
          <Link
            to={linkTo}
            className="flex w-max items-center gap-1 text-xs text-primary hover:underline"
          >
            {linkLabel} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 translate-x-4 translate-y-2 opacity-20">
        <Coffee className="h-24 w-24 text-stone-600" strokeWidth={1} />
      </div>
    </HomeSidebarCard>
  );
}
