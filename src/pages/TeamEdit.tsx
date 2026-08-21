import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTeam } from "@/hooks/useTeams";
import { supabase } from "@/lib/supabase";
import { getOwnedToken, isOwner } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/forms/PhotoUpload";
import { toast } from "sonner";

export default function TeamEdit() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: team, isLoading } = useTeam(slug);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (team) setForm({ ...team });
  }, [team]);

  if (isLoading || !form) return <div className="container py-16 text-center caption-text">Carregando...</div>;
  if (!team) return <div className="container py-16 text-center body-text">Equipe não encontrada.</div>;
  if (!isOwner(team.id)) {
    return (
      <div className="container py-16 text-center body-text">
        Você precisa do código de edição dessa equipe.
        <div className="mt-4"><Button onClick={() => navigate(`/equipe/${team.slug}`)}>Voltar</Button></div>
      </div>
    );
  }

  const save = async () => {
    setSaving(true);
    const token = getOwnedToken(team.id)!;
    const { error } = await supabase.rpc("update_team", {
      p_team_id: team.id,
      p_token: token,
      p: {
        name: form.name, city: form.city, state: form.state, description: form.description,
        instagram: form.instagram, whatsapp: form.whatsapp, website: form.website,
        logo_url: form.logo_url, cover_url: form.cover_url,
      },
    });
    setSaving(false);
    if (error) { toast.error("Não deu pra salvar."); return; }
    toast.success("Equipe atualizada!");
    navigate(`/equipe/${team.slug}`);
  };

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container py-6 max-w-sm space-y-4">
      <h1 className="heading-lg">Editar equipe</h1>
      <PhotoUpload folder={`teams/${team.slug}`} value={form.logo_url} onChange={(url) => setForm((f: any) => ({ ...f, logo_url: url }))} label="Logo" />
      <div><Label>Nome</Label><Input value={form.name ?? ""} onChange={set("name")} className="mt-1.5" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Cidade</Label><Input value={form.city ?? ""} onChange={set("city")} className="mt-1.5" /></div>
        <div><Label>Estado</Label><Input value={form.state ?? ""} onChange={set("state")} maxLength={2} className="mt-1.5" /></div>
      </div>
      <div><Label>Instagram</Label><Input value={form.instagram ?? ""} onChange={set("instagram")} className="mt-1.5" /></div>
      <div><Label>WhatsApp</Label><Input value={form.whatsapp ?? ""} onChange={set("whatsapp")} className="mt-1.5" /></div>
      <div><Label>Site</Label><Input value={form.website ?? ""} onChange={set("website")} className="mt-1.5" /></div>
      <div><Label>Descrição</Label><Textarea value={form.description ?? ""} onChange={set("description")} rows={4} className="mt-1.5" /></div>
      <Button className="w-full" onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</Button>
    </div>
  );
}
