import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useVehicle, useVehicles } from "@/hooks/useVehicles";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { getFacts, getSpecRows } from "@/lib/trunfo";
import { addToCollection, isInCollection, getFingerprint, isOwner } from "@/lib/storage";
import { trackView } from "@/lib/track";
import { shareCard } from "@/lib/share";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Pencil, PartyPopper, Trophy } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export default function CardDetail() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const qc = useQueryClient();
  const { data: vehicle, isLoading } = useVehicle(slug);
  const { data: all } = useVehicles();
  const cardRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [collected, setCollected] = useState(false);
  const [showAcquired, setShowAcquired] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setLikes(vehicle.likes_count);
      setCollected(isInCollection(vehicle.slug));
      trackView("vehicle", vehicle.id);
    }
  }, [vehicle?.id]);

  useEffect(() => {
    if (!vehicle) return;
    if (params.get("c") === "1" && !isInCollection(vehicle.slug)) {
      addToCollection(vehicle.slug);
      setCollected(true);
      setShowAcquired(true);
      setTimeout(() => setShowAcquired(false), 2200);
    }
  }, [vehicle, params]);

  if (isLoading) return <div className="container py-16 text-center caption-text">Carregando veículo...</div>;
  if (!vehicle) return <div className="container py-16 text-center body-text">Veículo não encontrado.</div>;

  const facts = getFacts(vehicle.history ?? {});
  const specRows = getSpecRows(vehicle.specs ?? {});
  const owner = isOwner(vehicle.team_id);
  const cardUrl = `${window.location.origin}/carta/${vehicle.slug}`;

  const toggleLike = async () => {
    const fp = getFingerprint();
    const willLike = !liked;
    setLiked(willLike);
    setLikes((n) => n + (willLike ? 1 : -1));
    const { data, error } = await supabase.rpc("toggle_like", { p_vehicle_id: vehicle.id, p_fingerprint: fp });
    if (!error && typeof data === "number") setLikes(data);
    qc.invalidateQueries({ queryKey: ["vehicles"] });
  };

  const collect = () => {
    addToCollection(vehicle.slug);
    setCollected(true);
    toast.success("Veículo adicionado à sua coleção!");
  };

  const doShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    const ok = await shareCard(cardRef.current, `${vehicle.slug}.png`, `${vehicle.name} · Garagem dos Sertões`);
    setSharing(false);
    if (!ok) toast.error("Não deu pra compartilhar. Tente baixar a imagem.");
  };

  return (
    <div className="container py-6 max-w-md">
      {showAcquired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-slide-up" onClick={() => setShowAcquired(false)}>
          <div className="text-center">
            <PartyPopper className="h-12 w-12 text-primary mx-auto mb-3" />
            <p className="heading-lg text-primary">Veículo adquirido!</p>
            <p className="body-text mt-1">{vehicle.name} agora é seu.</p>
          </div>
        </div>
      )}

      <div ref={cardRef} className="max-w-[300px] mx-auto mb-5">
        <TrunfoCard vehicle={vehicle} totalCount={all?.length} />
      </div>

      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        <Button variant={liked ? "default" : "secondary"} size="sm" className="gap-1.5" onClick={toggleLike}>
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likes}
        </Button>
        <Button variant={collected ? "secondary" : "default"} size="sm" onClick={collect} disabled={collected}>
          {collected ? "Na coleção" : "Colecionar"}
        </Button>
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={doShare} disabled={sharing}>
          <Share2 className="h-4 w-4" /> {sharing ? "..." : "Compartilhar"}
        </Button>
        {owner && (
          <Link to={`/carta/${vehicle.slug}/editar`}>
            <Button variant="outline" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Editar</Button>
          </Link>
        )}
      </div>

      {vehicle.result && (() => {
        const r = vehicle.result!;
        const pos = r.position_general;
        const isLeader = pos === 1;
        const isPodium = typeof pos === "number" && pos <= 3;
        return (
          <div
            className={cn(
              "relative overflow-hidden rounded-lg p-4 mb-4",
              isLeader ? "surface-elevated ring-1 ring-[hsl(var(--rarity-lendaria))]/50" : "surface-card",
            )}
          >
            {isLeader && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{ background: "radial-gradient(circle at 10% 0%, hsl(var(--rarity-lendaria)), transparent 60%)" }}
              />
            )}

            <div className="relative flex items-center gap-3 mb-3">
              {typeof pos === "number" && (
                <div
                  className={cn(
                    "h-14 w-14 rounded-full shrink-0 flex items-center justify-center font-display font-black italic text-xl leading-none",
                    isLeader
                      ? "bg-[hsl(var(--rarity-lendaria))] text-background"
                      : isPodium
                        ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                        : "bg-muted/50 text-foreground/80",
                  )}
                >
                  {pos}º
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="label-text text-primary flex items-center gap-1">
                  {isLeader && <Trophy className="h-3 w-3 shrink-0" />}
                  {isLeader ? "Líder da etapa" : "Resultado oficial"}
                </p>
                <p className="caption-text !text-xs truncate">
                  {r.stage_label}
                  {r.category_code ? ` · ${r.category_code}` : ""}
                  {vehicle.race_number ? ` · Nº ${vehicle.race_number}` : ""}
                </p>
              </div>
            </div>

            <div className="relative flex flex-wrap gap-1.5">
              {typeof r.position_category === "number" && (
                <span className="rounded-sm bg-muted/40 px-2 py-1 caption-text !text-xs">
                  {r.position_category}º na {r.category_code ?? "categoria"}
                </span>
              )}
              {r.time && <span className="num rounded-sm bg-muted/40 px-2 py-1 caption-text !text-xs">{r.time}</span>}
              {r.gap_leader && (
                <span className="num rounded-sm bg-muted/40 px-2 py-1 caption-text !text-xs">
                  {r.gap_leader === "LIDER" ? "na liderança" : `${r.gap_leader} do líder`}
                </span>
              )}
              {typeof r.penalty_min === "number" && r.penalty_min > 0 && (
                <span className="rounded-sm bg-destructive/15 text-destructive px-2 py-1 caption-text !text-xs">
                  {r.penalty_min} min de penalidade
                </span>
              )}
            </div>

            {r.team_official_name && r.team_official_name !== vehicle.teams?.name && (
              <p className="relative caption-text !text-[11px] mt-3 text-muted-foreground">
                Inscrita oficialmente no rally como "{r.team_official_name}"
              </p>
            )}

            <p className="relative caption-text !text-[10px] mt-2 text-muted-foreground/60">
              Cronometragem oficial · resultados.sertoes.com.br
            </p>
          </div>
        );
      })()}

      {facts.length > 0 && (
        <div className="surface-card rounded-lg p-4 mb-4">
          <p className="label-text mb-2.5">Histórico</p>
          <div className="flex flex-wrap gap-1.5">
            {facts.map((f) => (
              <span key={f.key} className="rounded-sm bg-muted/40 px-2 py-1 caption-text !text-xs">
                {f.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {specRows.length > 0 && (
        <div className="surface-card rounded-lg p-4 mb-4">
          <p className="label-text mb-2.5">Ficha técnica <span className="normal-case text-muted-foreground">· informada pela equipe</span></p>
          <div className="space-y-1.5">
            {specRows.map((s) => (
              <div key={s.key} className="flex items-center justify-between">
                <span className="caption-text !text-sm">{s.label}</span>
                <span className="num text-sm font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {vehicle.description && (
        <div className="surface-card rounded-lg p-4 mb-4">
          <p className="label-text mb-1.5">Sobre</p>
          <p className="body-text !text-sm">{vehicle.description}</p>
        </div>
      )}

      <div className="surface-card rounded-lg p-4 mb-4">
        <p className="label-text mb-1.5">Equipe</p>
        <Link to={`/equipe/${vehicle.teams?.slug}`} className="font-display font-bold uppercase italic text-lg text-primary">
          {vehicle.teams?.name}
        </Link>
      </div>

      <div className="surface-card rounded-lg p-4 flex items-center gap-4">
        <QRCodeSVG value={`${cardUrl}?c=1`} size={72} bgColor="transparent" fgColor="hsl(36, 20%, 95%)" />
        <div>
          <p className="label-text mb-1">Colecionar</p>
          <p className="caption-text !text-xs">Escaneie pra adicionar esse veículo à sua coleção.</p>
        </div>
      </div>
    </div>
  );
}
