import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useVehicles";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { TYPE_LABEL, TYPE_ORDER, type VehicleType } from "@/data/categories";
import { cn } from "@/lib/utils";

type SortKey = "numero" | "curtidas";

export default function Cards() {
  const { data: vehicles, isLoading } = useVehicles();
  const [type, setType] = useState<VehicleType | "all">("all");
  const [sort, setSort] = useState<SortKey>("numero");

  const filtered = useMemo(() => {
    let list = vehicles ?? [];
    if (type !== "all") list = list.filter((v) => v.type === type);
    list = [...list];
    if (sort === "curtidas") list.sort((a, b) => b.likes_count - a.likes_count);
    else list.sort((a, b) => a.card_number - b.card_number);
    return list;
  }, [vehicles, type, sort]);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="heading-lg">Cartas</h1>
        <span className="caption-text">{vehicles?.length ?? 0} no total</span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 -mx-4 px-4">
        <FilterChip active={type === "all"} onClick={() => setType("all")}>Todas</FilterChip>
        {TYPE_ORDER.map((t) => (
          <FilterChip key={t} active={type === t} onClick={() => setType(t)}>{TYPE_LABEL[t]}</FilterChip>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <FilterChip active={sort === "numero"} onClick={() => setSort("numero")} small>Nº</FilterChip>
        <FilterChip active={sort === "curtidas"} onClick={() => setSort("curtidas")} small>Mais curtidas</FilterChip>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="tcard animate-pulse bg-surface" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="body-text text-center py-16">Nenhuma carta por aqui ainda.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((v) => (
            <Link key={v.id} to={`/carta/${v.slug}`}>
              <TrunfoCard vehicle={v} totalCount={vehicles?.length} interactive={false} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children, small }: { active: boolean; onClick: () => void; children: React.ReactNode; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 label-text !text-[10px] transition-colors",
        small && "py-1 !text-[9px]",
        active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}
