import { Card } from "@/components/ui/card";
import { FeaturePill } from "./FeaturePill";
import { GardenerCard } from "./GardenerCard";
import type { homeFeatures, homeHero } from "@/config/home";

interface HomeHeroProps {
  hero: typeof homeHero;
  features: typeof homeFeatures;
  stats: Array<{
    label: string;
    value: number;
  }>;
}

export function HomeHero({ hero, features, stats }: HomeHeroProps) {
  return (
    <Card className="min-w-0 overflow-hidden border-border bg-[#fdfdfc] shadow-sm">
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-stretch lg:p-8">
        <div className="min-w-0 space-y-6">
          <div className="min-w-0 space-y-2">
            <h1 className="break-words text-3xl font-bold tracking-tight text-foreground underline decoration-primary/30 decoration-4 underline-offset-[6px] sm:text-4xl">
              {hero.title}
            </h1>
            <p className="max-w-[480px] break-words pt-2 text-base leading-relaxed text-muted-foreground">
              {hero.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-5 pt-2">
            {features.map((feature) => (
              <FeaturePill key={feature.title} {...feature} />
            ))}
          </div>
        </div>

        <GardenerCard stats={stats} />
      </div>
    </Card>
  );
}
