import { useRef, useState, useCallback } from "react";
import { Car, Bike, Truck, Trophy } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { getFacts, getCategory } from "@/lib/trunfo";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

const TYPE_ICON = { carro: Car, utv: Truck, moto: Bike, quadri: Bike, apoio: Truck } as const;

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
  const facts = getFacts(vehicle.history ?? {});
  const Icon = TYPE_ICON[vehicle.type] ?? Car;
  const hasTitle = (vehicle.history?.titles_general ?? 0) > 0 || (vehicle.history?.titles_category ?? 0) > 0;

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
      className={cn("tcard", "tier-lendaria", active && "is-active", className)}
      onPointerMove={interactive ? (e) => { setActive(true); onMove(e.clientX, e.clientY); } : undefined}
      onPointerLeave={interactive ? reset : undefined}
      onPointerDown={interactive ? (e) => { setActive(true); onMove(e.clientX, e.clientY); } : undefined}
    >
      <div className="absolute inset-0 flex flex-col" style={{ transform: "translateZ(1px)" }}>
        <div className="relative h-[58%] shrink-0 overflow-hidden bg-surface-elevated">
          {vehicle.photo_url ? (
            <OptimizedImage src={vehicle.photo_url} alt={vehicle.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-surface-elevated to-surface">
              <Icon className="h-16 w-16 text-muted-foreground/30" strokeWidth={1.2} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          <div className="absolute top-2 left-2 rounded-sm bg-background/70 backdrop-blur px-2 py-0.5">
            <span className="label-text !text-[9px]">{vehicle.result?.category_code ?? category.short}</span>
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

          <div className="flex-1 min-h-0 overflow-hidden flex flex-wrap content-start gap-1">
            {facts.length > 0 ? (
              facts.slice(0, 2).map((f) => (
                <span key={f.key} className="max-w-full truncate rounded-sm bg-muted/40 px-1.5 py-0.5 caption-text !text-[9px] leading-tight">
                  {f.label}
                </span>
              ))
            ) : (
              <span className="caption-text !text-[10px] text-muted-foreground/60">Histórico a confirmar</span>
            )}
          </div>

          <div className="shrink-0 mt-1.5 flex items-center justify-between border-t border-border/60 pt-1.5">
            <span className="caption-text !text-[10px] truncate">{vehicle.teams?.name}</span>
            {hasTitle && <Trophy className="h-3 w-3 text-rarity-lendaria shrink-0" />}
          </div>
        </div>
      </div>

      <div className="tcard-shimmer" />
      <div className="tcard-foil foil-lendaria" />
      <div className="tcard-glare" />
      <div className="tcard-frame" style={{ background: "linear-gradient(135deg, hsl(var(--tier)), transparent 60%)" }} />
    </div>
  );
}
