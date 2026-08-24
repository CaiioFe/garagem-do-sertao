import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTeam } from "@/hooks/useTeams";
import { useTeamVehicles } from "@/hooks/useVehicles";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isOwner, setOwnedToken } from "@/lib/storage";
import { trackView } from "@/lib/track";
import { supabase } from "@/lib/supabase";
import { Instagram, MessageCircle, Globe, Users, Plus, Pencil, KeyRound } from "lucide-react";
import { toast } from "sonner";

export default function TeamDetail() {
  const { slug } = useParams();
  const { data: team, isLoading } = useTeam(slug);
  const { data: vehicles } = useTeamVehicles(team?.id);
  const [claiming, setClaiming] = useState(false);
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (team) trackView("team", team.id);
  }, [team?.id]);

  if (isLoading) return <div className="container py-16 text-center caption-text">Carregando equipe...</div>;
  if (!team) return <div className="container py-16 text-center body-text">Equipe não encontrada.</div>;

  const owner = isOwner(team.id);

  const claim = async () => {
    setChecking(true);
    const { data, error } = await supabase.rpc("verify_team_token", { p_team_id: team.id, p_token: code.trim() });
    setChecking(false);
    if (error || !data) {
      toast.error("Código inválido.");
      return;
    }
    setOwnedToken(team.id, code.trim());
    toast.success("Equipe reivindicada! Agora você pode editar.");
    setClaiming(false);
    window.location.reload();
  };

  return (
    <div className="container py-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-16 w-16 rounded-md overflow-hidden shrink-0 bg-white flex items-center justify-center p-2">
          {team.logo_url ? <img src={team.logo_url} alt={team.name} className="h-full w-full object-contain" loading="lazy" /> : <Users className="h-7 w-7 text-muted-foreground/40" />}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="heading-lg !text-2xl">{team.name}</h1>
          <p className="caption-text">{[team.city, team.state].filter(Boolean).join(" · ") || "Cidade não informada"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {team.instagram && (
          <a href={`https://instagram.com/${team.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <Instagram className="h-3.5 w-3.5" /> @{team.instagram}
          </a>
        )}
        {team.whatsapp && (
          <a href={`https://wa.me/${team.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        )}
        {team.website && (
          <a href={team.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            <Globe className="h-3.5 w-3.5" /> Site
          </a>
        )}
      </div>

      {team.description && <p className="body-text mb-5">{team.description}</p>}

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Link to={`/equipe/${team.slug}/novo-veiculo`}>
          <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Adicionar veículo</Button>
        </Link>
        {owner ? (
          <Link to={`/equipe/${team.slug}/editar`}>
            <Button variant="secondary" size="sm" className="gap-1.5"><Pencil className="h-3.5 w-3.5" /> Editar equipe</Button>
          </Link>
        ) : (
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => setClaiming((v) => !v)}>
            <KeyRound className="h-3.5 w-3.5" /> Sou dessa equipe
          </Button>
        )}
      </div>

      {claiming && (
        <div className="surface-card rounded-lg p-3 mb-6 flex gap-2">
          <Input placeholder="Código, ex: FICI-7K3Q" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="flex-1" />
          <Button size="sm" onClick={claim} disabled={checking || !code.trim()}>{checking ? "..." : "Entrar"}</Button>
        </div>
      )}

      <h2 className="heading-md !text-base mb-3">Veículos da equipe</h2>
      {!vehicles || vehicles.length === 0 ? (
        <p className="body-text py-8 text-center">Ainda sem veículos cadastrados.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {vehicles.map((v) => (
            <Link key={v.id} to={`/carta/${v.slug}`}>
              <TrunfoCard vehicle={v} interactive={false} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
