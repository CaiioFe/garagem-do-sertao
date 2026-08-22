import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAdminPin, setAdminPin, isAdmin } from "@/lib/storage";
import { useTeams } from "@/hooks/useTeams";
import { useVehicles } from "@/hooks/useVehicles";
import { PARTNERS } from "@/data/partners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Eye, EyeOff, Users, MousePointerClick, Heart } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  total_views: number;
  unique_visitors: number;
  total_likes: number;
  views_by_team: { name: string; slug: string; views: number }[];
  views_by_vehicle: { name: string; slug: string; views: number }[];
  clicks_by_partner: { partner_id: string; clicks: number }[];
}

export default function Admin() {
  const [authed, setAuthed] = useState(isAdmin());
  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const { data: teams, refetch: refetchTeams } = useTeams();
  const { data: vehicles, refetch: refetchVehicles } = useVehicles();

  const savedPin = getAdminPin() ?? "";

  const loadStats = async (p: string) => {
    const { data, error } = await supabase.rpc("admin_get_stats", { p_pin: p });
    if (!error && data) setStats(data as Stats);
  };

  useEffect(() => {
    if (authed && savedPin) loadStats(savedPin);
  }, [authed]);

  const login = async () => {
    setChecking(true);
    const { data, error } = await supabase.rpc("admin_verify", { p_pin: pin.trim() });
    setChecking(false);
    if (error || !data) { toast.error("PIN incorreto."); return; }
    setAdminPin(pin.trim());
    setAuthed(true);
  };

  const getTeamCode = async (teamId: string) => {
    const { data, error } = await supabase.rpc("admin_get_team_token", { p_pin: savedPin, p_team_id: teamId });
    if (error || !data) { toast.error("Erro ao buscar código."); return; }
    navigator.clipboard.writeText(data as string);
    toast.success(`Código copiado: ${data}`);
  };

  const toggleStatus = async (kind: "team" | "vehicle", id: string, current: string) => {
    const next = current === "active" ? "hidden" : "active";
    const { error } = await supabase.rpc("admin_set_status", { p_pin: savedPin, p_kind: kind, p_id: id, p_status: next });
    if (error) { toast.error("Erro."); return; }
    kind === "team" ? refetchTeams() : refetchVehicles();
  };

  if (!authed) {
    return (
      <div className="container py-16 max-w-xs mx-auto text-center">
        <h1 className="heading-lg mb-4">Admin</h1>
        <Input type="password" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="text-center" />
        <Button className="w-full mt-3" onClick={login} disabled={checking}>Entrar</Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="heading-lg mb-5">Admin</h1>

      {stats && (
        <div className="mb-6">
          <h2 className="label-text mb-2">Estatísticas</h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="surface-card rounded-lg p-3 text-center">
              <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="num text-xl font-bold">{stats.unique_visitors}</p>
              <p className="caption-text !text-[10px]">visitantes</p>
            </div>
            <div className="surface-card rounded-lg p-3 text-center">
              <MousePointerClick className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="num text-xl font-bold">{stats.total_views}</p>
              <p className="caption-text !text-[10px]">visualizações</p>
            </div>
            <div className="surface-card rounded-lg p-3 text-center">
              <Heart className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className="num text-xl font-bold">{stats.total_likes}</p>
              <p className="caption-text !text-[10px]">curtidas</p>
            </div>
          </div>

          {stats.views_by_team.length > 0 && (
            <div className="surface-card rounded-lg p-3 mb-2">
              <p className="label-text mb-1.5">Equipes mais vistas</p>
              {stats.views_by_team.map((t) => (
                <div key={t.slug} className="flex items-center justify-between text-sm py-0.5">
                  <span className="truncate">{t.name}</span>
                  <span className="num font-semibold shrink-0">{t.views}</span>
                </div>
              ))}
            </div>
          )}

          {stats.views_by_vehicle.length > 0 && (
            <div className="surface-card rounded-lg p-3 mb-2">
              <p className="label-text mb-1.5">Veículos mais vistos</p>
              {stats.views_by_vehicle.map((v) => (
                <div key={v.slug} className="flex items-center justify-between text-sm py-0.5">
                  <span className="truncate">{v.name}</span>
                  <span className="num font-semibold shrink-0">{v.views}</span>
                </div>
              ))}
            </div>
          )}

          {stats.clicks_by_partner.length > 0 && (
            <div className="surface-card rounded-lg p-3">
              <p className="label-text mb-1.5">Cliques em expedições</p>
              {stats.clicks_by_partner.map((c) => {
                const partner = PARTNERS.find((p) => p.id === c.partner_id);
                return (
                  <div key={c.partner_id} className="flex items-center justify-between text-sm py-0.5">
                    <span className="truncate">{partner?.name ?? c.partner_id}</span>
                    <span className="num font-semibold shrink-0">{c.clicks}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <h2 className="label-text mb-2">Equipes</h2>
      <div className="space-y-2 mb-6">
        {teams?.map((t) => (
          <div key={t.id} className="surface-card rounded-lg p-3 flex items-center gap-2">
            <span className="flex-1 text-sm font-semibold truncate">{t.name}</span>
            <Button variant="ghost" size="sm" onClick={() => getTeamCode(t.id)}><Copy className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="sm" onClick={() => toggleStatus("team", t.id, t.status)}>
              {t.status === "active" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-destructive" />}
            </Button>
          </div>
        ))}
      </div>

      <h2 className="label-text mb-2">Veículos</h2>
      <div className="space-y-2">
        {vehicles?.map((v) => (
          <div key={v.id} className="surface-card rounded-lg p-3 flex items-center gap-2">
            <span className="flex-1 text-sm font-semibold truncate">{v.name} <span className="caption-text">· {v.teams?.name}</span></span>
            <Button variant="ghost" size="sm" onClick={() => toggleStatus("vehicle", v.id, v.status)}>
              {v.status === "active" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-destructive" />}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
