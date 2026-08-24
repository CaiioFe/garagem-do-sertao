import { Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useVehicles";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Resultados() {
  const { data: vehicles, isLoading } = useVehicles();

  const ranked = [...(vehicles ?? [])]
    .filter((v) => typeof v.result?.position_general === "number")
    .sort((a, b) => a.result!.position_general! - b.result!.position_general!);

  const stageLabel = ranked[0]?.result?.stage_label;

  return (
    <div className="container py-6 max-w-lg">
      <p className="label-text text-primary mb-1">Nossa garagem no rally</p>
      <h1 className="heading-lg">Resultados{stageLabel ? ` · ${stageLabel}` : ""}</h1>
      <p className="body-text !text-sm mt-1 mb-5 max-w-md">
        Como estão indo os veículos cadastrados aqui, direto da cronometragem oficial.
      </p>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-surface animate-pulse" />
          ))}
        </div>
      ) : ranked.length === 0 ? (
        <p className="body-text text-center py-16">Ainda sem resultado oficial pra mostrar.</p>
      ) : (
        <div className="space-y-2">
          {ranked.map((v) => {
            const r = v.result!;
            const pos = r.position_general!;
            const isLeader = pos === 1;
            const isPodium = pos <= 3;
            return (
              <Link
                key={v.id}
                to={`/carta/${v.slug}`}
                className="relative overflow-hidden surface-card rounded-lg p-3 flex items-center gap-3"
              >
                {isLeader && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-15"
                    style={{ background: "radial-gradient(circle at 0% 0%, hsl(var(--rarity-lendaria)), transparent 60%)" }}
                  />
                )}
                <div
                  className={cn(
                    "relative h-10 w-10 rounded-full shrink-0 flex items-center justify-center font-display font-black italic text-sm leading-none",
                    isLeader
                      ? "bg-[hsl(var(--rarity-lendaria))] text-background"
                      : isPodium
                        ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                        : "bg-muted/50 text-foreground/80",
                  )}
                >
                  {pos}º
                </div>

                <div className="relative h-10 w-10 rounded-md overflow-hidden shrink-0 bg-surface-elevated">
                  {v.photo_url && (
                    <OptimizedImage src={v.photo_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>

                <div className="relative min-w-0 flex-1">
                  <p className="font-display font-bold uppercase italic text-sm leading-tight truncate">{v.name}</p>
                  <p className="caption-text !text-[11px] truncate">
                    {v.teams?.name}
                    {r.category_code ? ` · ${r.category_code}` : ""}
                  </p>
                </div>

                <div className="relative text-right shrink-0">
                  {isLeader ? (
                    <span className="label-text !text-[9px] text-[hsl(var(--rarity-lendaria))] flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> líder
                    </span>
                  ) : (
                    <span className="num text-xs font-semibold">{r.gap_leader ?? "—"}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <p className="caption-text !text-[10px] text-muted-foreground/60 mt-6 text-center">
        Cronometragem oficial, resultados.sertoes.com.br · só os veículos cadastrados na Garagem do Sertão.
      </p>
    </div>
  );
}
