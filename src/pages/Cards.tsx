import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useVehicles";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { TYPE_LABEL, TYPE_ORDER, type VehicleType } from "@/data/categories";
import { cn } from "@/lib/utils";

export default function Cards() {
  const { data: vehicles, isLoading } = useVehicles();
  const [type, setType] = useState<VehicleType | "all">("all");

  const filtered = useMemo(() => {
    let list = vehicles ?? [];
    if (type !== "all") list = list.filter((v) => v.type === type);
    return [...list].sort((a, b) => a.card_number - b.card_number);
  }, [vehicles, type]);

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="heading-lg">Veículos</h1>
        <span className="caption-text">{vehicles?.length ?? 0} no total</span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 -mx-4 px-4 mb-1">
        <FilterChip active={type === "all"} onClick={() => setType("all")}>Todos</FilterChip>
        {TYPE_ORDER.map((t) => (
          <FilterChip key={t} active={type === t} onClick={() => setType(t)}>{TYPE_LABEL[t]}</FilterChip>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="tcard animate-pulse bg-surface" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="body-text text-center py-16">Nenhum veículo por aqui ainda.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
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

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 label-text !text-[10px] transition-colors",
        active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}
