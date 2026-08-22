import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useVehicles";
import { computeAttributes, getCategory } from "@/lib/trunfo";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

function randomOther(list: Vehicle[], excludeId?: string) {
  const pool = list.filter((v) => v.id !== excludeId);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Compare() {
  const { data: vehicles } = useVehicles();
  const [params] = useSearchParams();
  const [a, setA] = useState<Vehicle | null>(null);
  const [b, setB] = useState<Vehicle | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicles || vehicles.length < 2) return;
    const aSlug = params.get("a");
    const found = aSlug ? vehicles.find((v) => v.slug === aSlug) : null;
    const first = found ?? randomOther(vehicles);
    const second = randomOther(vehicles, first?.id);
    setA(first);
    setB(second);
  }, [vehicles, params]);

  const attrsA = useMemo(() => (a ? computeAttributes(a.specs ?? {}, a.history ?? {}, getCategory(a.category_id)) : []), [a]);
  const attrsB = useMemo(() => (b ? computeAttributes(b.specs ?? {}, b.history ?? {}, getCategory(b.category_id)) : []), [b]);

  if (!vehicles || vehicles.length < 2) {
    return <div className="container py-16 text-center body-text">Precisa de pelo menos 2 cartas cadastradas pra comparar.</div>;
  }
  if (!a || !b) return null;

  const shuffle = () => {
    const first = randomOther(vehicles);
    const second = randomOther(vehicles, first?.id);
    setA(first);
    setB(second);
    setHighlighted(null);
  };

  return (
    <div className="container py-6 max-w-md">
      <h1 className="heading-lg flex items-center gap-2 mb-1"><Scale className="h-5 w-5 text-primary" /> Comparar</h1>
      <p className="caption-text mb-5">
        Ficha técnica lado a lado. Quem é melhor no rally decide a pista, não a gente — aqui é só pra você bater o olho.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <TrunfoCard vehicle={a} interactive={false} />
        <TrunfoCard vehicle={b} interactive={false} />
      </div>

      <div className="space-y-2">
        {attrsA.map((attr, i) => {
          const attrB = attrsB[i];
          const active = highlighted === attr.key;
          const aBigger = attr.score > attrB.score;
          const bBigger = attrB.score > attr.score;
          return (
            <button
              key={attr.key}
              onClick={() => setHighlighted(active ? null : attr.key)}
              className="w-full surface-card rounded-lg p-3 flex items-center justify-between hover:surface-elevated transition-colors"
            >
              <span className={cn("num text-lg font-bold w-14 text-left", active && aBigger && "text-primary")}>{attr.score}</span>
              <span className="label-text">{attr.label}</span>
              <span className={cn("num text-lg font-bold w-14 text-right", active && bBigger && "text-primary")}>{attrB.score}</span>
            </button>
          );
        })}
      </div>
      <p className="caption-text !text-[11px] text-center mt-3">
        Toque num atributo pra destacar quem tem o número maior. Não é veredito de quem ganharia.
      </p>

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
