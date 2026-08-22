import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useVehicles";
import { getFacts, getSpecRows, getCategory } from "@/lib/trunfo";
import { TYPE_LABEL } from "@/data/categories";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { Scale } from "lucide-react";
import type { Vehicle } from "@/lib/types";

function randomOther(list: Vehicle[], excludeId?: string) {
  const pool = list.filter((v) => v.id !== excludeId);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function Column({ vehicle }: { vehicle: Vehicle }) {
  const category = getCategory(vehicle.category_id);
  const facts = getFacts(vehicle.history ?? {});
  const specs = getSpecRows(vehicle.specs ?? {});
  return (
    <div className="min-w-0">
      <p className="label-text mb-1">Categoria</p>
      <p className="body-text !text-sm mb-3">{category.name} · {TYPE_LABEL[vehicle.type]}</p>

      <p className="label-text mb-1">Histórico</p>
      {facts.length > 0 ? (
        <ul className="space-y-1 mb-3">
          {facts.map((f) => <li key={f.key} className="body-text !text-sm">{f.label}</li>)}
        </ul>
      ) : (
        <p className="caption-text !text-sm mb-3">Sem histórico registrado ainda.</p>
      )}

      {specs.length > 0 && (
        <>
          <p className="label-text mb-1">Ficha técnica <span className="normal-case text-muted-foreground">(da equipe)</span></p>
          <ul className="space-y-1">
            {specs.map((s) => <li key={s.key} className="body-text !text-sm">{s.label}: {s.value}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}

export default function Compare() {
  const { data: vehicles } = useVehicles();
  const [params] = useSearchParams();
  const [a, setA] = useState<Vehicle | null>(null);
  const [b, setB] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!vehicles || vehicles.length < 2) return;
    const aSlug = params.get("a");
    const found = aSlug ? vehicles.find((v) => v.slug === aSlug) : null;
    const first = found ?? randomOther(vehicles);
    const second = randomOther(vehicles, first?.id);
    setA(first);
    setB(second);
  }, [vehicles, params]);

  if (!vehicles || vehicles.length < 2) {
    return <div className="container py-16 text-center body-text">Precisa de pelo menos 2 cartas cadastradas pra comparar.</div>;
  }
  if (!a || !b) return null;

  const shuffle = () => {
    const first = randomOther(vehicles);
    const second = randomOther(vehicles, first?.id);
    setA(first);
    setB(second);
  };

  return (
    <div className="container py-6 max-w-md">
      <h1 className="heading-lg flex items-center gap-2 mb-1"><Scale className="h-5 w-5 text-primary" /> Comparar</h1>
      <p className="caption-text mb-5">
        Ficha lado a lado, só com o que a gente sabe de verdade. Quem é melhor no rally é a pista que decide, não o app.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <TrunfoCard vehicle={a} interactive={false} />
        <TrunfoCard vehicle={b} interactive={false} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Column vehicle={a} />
        <Column vehicle={b} />
      </div>

      <div className="text-center mt-6">
        <button onClick={shuffle} className="label-text text-primary underline underline-offset-2">
          comparar outras duas cartas
        </button>
      </div>

      <div className="text-center mt-4">
        <Link to="/cartas" className="caption-text underline">ver todas as cartas</Link>
      </div>
    </div>
  );
}
