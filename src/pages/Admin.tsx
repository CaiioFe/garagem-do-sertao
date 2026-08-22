import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAdminPin, setAdminPin, isAdmin } from "@/lib/storage";
import { useTeams } from "@/hooks/useTeams";
import { useVehicles } from "@/hooks/useVehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [authed, setAuthed] = useState(isAdmin());
  const [pin, setPin] = useState("");
  const [checking, setChecking] = useState(false);
  const { data: teams, refetch: refetchTeams } = useTeams();
  const { data: vehicles, refetch: refetchVehicles } = useVehicles();

  const login = async () => {
    setChecking(true);
    const { data, error } = await supabase.rpc("admin_verify", { p_pin: pin.trim() });
    setChecking(false);
    if (error || !data) { toast.error("PIN incorreto."); return; }
    setAdminPin(pin.trim());
    setAuthed(true);
  };

  const savedPin = getAdminPin() ?? "";

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

      <h2 className="label-text mb-2">Cartas</h2>
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
