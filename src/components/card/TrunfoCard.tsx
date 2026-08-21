import { useRef, useState, useCallback } from "react";
import { Car, Bike, Truck, Trophy } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { computeAttributes, computeRarity, computeCompleteness, getCategory, TIER_LABEL, type Tier } from "@/lib/trunfo";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

const TYPE_ICON = { carro: Car, utv: Truck, moto: Bike, quadri: Bike, apoio: Truck } as const;

export const TIER_TEXT_CLASS: Record<Tier, string> = {
  comum: "text-rarity-comum",
  rara: "text-rarity-rara",
  epica: "text-rarity-epica",
  lendaria: "text-rarity-lendaria",
  mitica: "text-rarity-mitica",
};

interface TrunfoCardProps {
  vehicle: Vehicle;
  totalCount?: number;
  interactive?: boolean;
  className?: string;
}

export function TrunfoCard({ vehicle, totalCount, interactive = true, className }: TrunfoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const category = getCategory(vehicle.category_id);
  const attrs = computeAttributes(vehicle.specs ?? {}, vehicle.history ?? {}, category);
  const completeness = computeCompleteness(vehicle);
  const { tier } = computeRarity(vehicle.history ?? {}, category, completeness);
  const Icon = TYPE_ICON[vehicle.type] ?? Car;

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const ry = (x - 0.5) * 14;
      const rx = (0.5 - y) * 14;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      el.style.setProperty("--op", "1");
    },
    [],
  );

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--op", "0");
    setActive(false);
  }, []);

  return (
    <div
      ref={ref}
      className={cn("tcard tier-" + tier, active && "is-active", className)}
      onPointerMove={interactive ? (e) => { setActive(true); onMove(e.clientX, e.clientY); } : undefined}
      onPointerLeave={interactive ? reset : undefined}
      onPointerDown={interactive ? (e) => { setActive(true); onMove(e.clientX, e.clientY); } : undefined}
    >
      <div className="absolute inset-0 flex flex-col" style={{ transform: "translateZ(1px)" }}>
        <div className="relative h-[52%] shrink-0 overflow-hidden bg-surface-elevated">
          {vehicle.photo_url ? (
            <OptimizedImage src={vehicle.photo_url} alt={vehicle.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-surface-elevated to-surface">
              <Icon className="h-16 w-16 text-muted-foreground/30" strokeWidth={1.2} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          <div className="absolute top-2 left-2 rounded-sm bg-background/70 backdrop-blur px-2 py-0.5">
            <span className="label-text !text-[9px]">{category.short}</span>
          </div>
          <div className={cn("absolute top-2 right-2 rounded-sm px-2 py-0.5 backdrop-blur bg-background/70", TIER_TEXT_CLASS[tier])}>
            <span className="label-text !text-[9px]" style={{ color: "currentColor" }}>{TIER_LABEL[tier]}</span>
          </div>
          <div className="absolute bottom-1.5 right-2 num text-[10px] text-foreground/60 tabular-nums">
            #{String(vehicle.card_number).padStart(3, "0")}
            {totalCount ? `/${totalCount}` : ""}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col px-3 pt-2.5 pb-2">
          <h3 className="font-display font-extrabold uppercase italic text-lg leading-[0.95] tracking-tight truncate">
            {vehicle.name}
          </h3>
          <p className="caption-text !text-[11px] truncate mb-1.5">
            {vehicle.pilot_name || "Piloto a confirmar"}
            {vehicle.navigator_name ? ` · ${vehicle.navigator_name}` : ""}
          </p>

          <div className="flex-1 min-h-0 grid grid-cols-2 gap-x-3 gap-y-1 content-start">
            {attrs.map((a) => (
              <div key={a.key} className="flex items-center justify-between gap-1">
                <span className="label-text !text-[8px] truncate">{a.label}</span>
                <span className="num text-xs font-bold tabular-nums shrink-0">{a.score}</span>
              </div>
            ))}
          </div>

          <div className="mt-1.5 flex items-center justify-between border-t border-border/60 pt-1.5">
            <span className="caption-text !text-[10px] truncate">{vehicle.teams?.name}</span>
            {(vehicle.history?.titles_general || vehicle.history?.titles_category) ? (
              <Trophy className="h-3 w-3 text-rarity-lendaria shrink-0" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="tcard-shimmer" />
      <div className={cn("tcard-foil", "foil-" + tier)} />
      <div className="tcard-glare" />
      <div className="tcard-frame" style={{ background: "linear-gradient(135deg, hsl(var(--tier)), transparent 60%)" }} />
    </div>
  );
}
