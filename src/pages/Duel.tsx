import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useVehicles";
import { computeAttributes, getCategory } from "@/lib/trunfo";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Swords } from "lucide-react";
import type { Vehicle } from "@/lib/types";

function randomOther(list: Vehicle[], excludeId?: string) {
  const pool = list.filter((v) => v.id !== excludeId);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Duel() {
  const { data: vehicles } = useVehicles();
  const [params] = useSearchParams();
  const [a, setA] = useState<Vehicle | null>(null);
  const [b, setB] = useState<Vehicle | null>(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [winnerAttr, setWinnerAttr] = useState<"a" | "b" | "tie" | null>(null);

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
    return <div className="container py-16 text-center body-text">Precisa de pelo menos 2 cartas cadastradas pra duelar.</div>;
  }
  if (!a || !b) return null;

  const pick = (key: string) => {
    if (picked) return;
    const va = attrsA.find((x) => x.key === key)!.score;
    const vb = attrsB.find((x) => x.key === key)!.score;
    setPicked(key);
    if (va > vb) { setScoreA((s) => s + 1); setWinnerAttr("a"); }
    else if (vb > va) { setScoreB((s) => s + 1); setWinnerAttr("b"); }
    else setWinnerAttr("tie");
  };

  const next = () => {
    if (round >= 2 || scoreA === 2 || scoreB === 2) {
      const first = randomOther(vehicles);
      const second = randomOther(vehicles, first?.id);
      setA(first); setB(second); setScoreA(0); setScoreB(0); setRound(0); setPicked(null); setWinnerAttr(null);
      return;
    }
    setRound((r) => r + 1);
    setPicked(null);
    setWinnerAttr(null);
  };

  const matchOver = scoreA === 2 || scoreB === 2 || round >= 2;
  const matchWinner = scoreA > scoreB ? "a" : scoreB > scoreA ? "b" : "tie";

  return (
    <div className="container py-6 max-w-md">
      <h1 className="heading-lg flex items-center gap-2 mb-1"><Swords className="h-5 w-5 text-primary" /> Duelo</h1>
      <p className="caption-text mb-5">Rodada {round + 1} de 3 · melhor de 3</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className={cn(winnerAttr && (matchOver ? matchWinner === "a" : winnerAttr === "a") && "ring-2 ring-rarity-lendaria rounded-lg animate-glow-pulse")}>
          <TrunfoCard vehicle={a} interactive={false} />
          <p className="text-center num text-2xl font-black mt-2">{scoreA}</p>
        </div>
        <div className={cn(winnerAttr && (matchOver ? matchWinner === "b" : winnerAttr === "b") && "ring-2 ring-rarity-lendaria rounded-lg animate-glow-pulse")}>
          <TrunfoCard vehicle={b} interactive={false} />
          <p className="text-center num text-2xl font-black mt-2">{scoreB}</p>
        </div>
      </div>

      {!picked ? (
        <div className="space-y-2">
          <p className="label-text text-center mb-2">Escolha o atributo</p>
          {attrsA.map((attr, i) => (
            <button key={attr.key} onClick={() => pick(attr.key)} className="w-full surface-card rounded-lg p-3 flex items-center justify-between hover:surface-elevated transition-colors">
              <span className="num text-lg font-bold w-10 text-left">{attr.score}</span>
              <span className="label-text">{attr.label}</span>
              <span className="num text-lg font-bold w-10 text-right">{attrsB[i].score}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="heading-md !text-lg mb-3">
            {winnerAttr === "tie" ? "Empate na rodada!" : winnerAttr === "a" ? `${a.name} venceu a rodada!` : `${b.name} venceu a rodada!`}
          </p>
          <Button onClick={next}>{matchOver ? "Novo duelo" : "Próxima rodada"}</Button>
        </div>
      )}

      {matchOver && picked && (
        <p className="text-center heading-lg mt-6 text-primary">
          {matchWinner === "tie" ? "Duelo empatado!" : `${matchWinner === "a" ? a.name : b.name} venceu o duelo!`}
        </p>
      )}

      <div className="text-center mt-8">
        <Link to="/cartas" className="caption-text underline">ver todas as cartas</Link>
      </div>
    </div>
  );
}
