interface StatItem {
  label: string;
  value: number;
}

interface StatStripProps {
  items: StatItem[];
}

export function StatStrip({ items }: StatStripProps) {
  return (
    <div
      className="mt-5 grid divide-x divide-border text-center"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0 px-1">
          <p className="truncate text-lg font-bold text-foreground">
            {item.value}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
