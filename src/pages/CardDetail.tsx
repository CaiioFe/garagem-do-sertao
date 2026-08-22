import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useVehicle, useVehicles } from "@/hooks/useVehicles";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { getFacts, getSpecRows } from "@/lib/trunfo";
import { addToCollection, isInCollection, getFingerprint, isOwner } from "@/lib/storage";
import { shareCard } from "@/lib/share";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Scale, Pencil, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

export default function CardDetail() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
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
    }
  }, [vehicle]);

  useEffect(() => {
    if (!vehicle) return;
    if (params.get("c") === "1" && !isInCollection(vehicle.slug)) {
      addToCollection(vehicle.slug);
      setCollected(true);
      setShowAcquired(true);
      setTimeout(() => setShowAcquired(false), 2200);
    }
  }, [vehicle, params]);

  if (isLoading) return <div className="container py-16 text-center caption-text">Carregando carta...</div>;
  if (!vehicle) return <div className="container py-16 text-center body-text">Carta não encontrada.</div>;

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
    toast.success("Carta adicionada à sua coleção!");
  };

  const doShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    const ok = await shareCard(cardRef.current, `${vehicle.slug}.png`, `${vehicle.name} · Garagem do Sertão`);
    setSharing(false);
    if (!ok) toast.error("Não deu pra compartilhar. Tente baixar a carta.");
  };

  return (
    <div className="container py-6 max-w-md">
      {showAcquired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-slide-up" onClick={() => setShowAcquired(false)}>
          <div className="text-center">
            <PartyPopper className="h-12 w-12 text-primary mx-auto mb-3" />
            <p className="heading-lg text-primary">Carta adquirida!</p>
            <p className="body-text mt-1">{vehicle.name} agora é sua.</p>
          </div>
        </div>
      )}

      <div ref={cardRef} className="max-w-[300px] mx-auto mb-5">
        <TrunfoCard vehicle={vehicle} totalCount={all?.length} />
      </div>

      <div className="flex items-center justify-center gap-2 mb-5">
        <Button variant={liked ? "default" : "secondary"} size="sm" className="gap-1.5" onClick={toggleLike}>
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likes}
        </Button>
        <Button variant={collected ? "secondary" : "default"} size="sm" onClick={collect} disabled={collected}>
          {collected ? "Na coleção" : "Colecionar"}
        </Button>
        <Button variant="secondary" size="sm" className="gap-1.5" onClick={doShare} disabled={sharing}>
          <Share2 className="h-4 w-4" /> {sharing ? "..." : "Compartilhar"}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(`/duelo?a=${vehicle.slug}`)}>
          <Scale className="h-3.5 w-3.5" /> Comparar com outra carta
        </Button>
        {owner && (
          <Link to={`/carta/${vehicle.slug}/editar`}>
            <Button variant="outline" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Editar</Button>
          </Link>
        )}
      </div>

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
          <p className="caption-text !text-xs">Escaneie pra adicionar essa carta à sua coleção.</p>
        </div>
      </div>
    </div>
  );
}
