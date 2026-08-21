import type { AttrRow } from "@/lib/trunfo";

export function AttrBar({ attr }: { attr: AttrRow }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="label-text">{attr.label}</span>
        <span className="num text-sm font-bold">
          {attr.score} <span className="text-muted-foreground font-normal text-[10px]">{attr.raw}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${attr.score}%` }} />
      </div>
    </div>
  );
}
