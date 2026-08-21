import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVehicle } from "@/hooks/useVehicles";
import { useTeam } from "@/hooks/useTeams";
import { supabase } from "@/lib/supabase";
import { getOwnedToken, isOwner } from "@/lib/storage";
import { slugify } from "@/lib/slug";
import { CATEGORIES, TYPE_LABEL, TYPE_ORDER, type VehicleType } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/forms/PhotoUpload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function VehicleEdit() {
  const { vehicleSlug, teamSlug } = useParams();
  const navigate = useNavigate();
  const isCreate = !!teamSlug;

  const { data: vehicle, isLoading: loadingVehicle } = useVehicle(vehicleSlug);
  const { data: team, isLoading: loadingTeam } = useTeam(isCreate ? teamSlug : vehicle?.teams?.slug);

  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isCreate && team) {
      setForm({ type: "carro", category_id: CATEGORIES.find((c) => c.type === "carro")!.id, specs: {}, history: {} });
    } else if (!isCreate && vehicle) {
      setForm({ ...vehicle });
    }
  }, [isCreate, team, vehicle]);

  const loading = isCreate ? loadingTeam : loadingVehicle;
  if (loading || !form) return <div className="container py-16 text-center caption-text">Carregando...</div>;

  const effectiveTeam = isCreate ? team : { id: vehicle?.team_id, slug: vehicle?.teams?.slug };
  if (!effectiveTeam?.id) return <div className="container py-16 text-center body-text">Não encontrado.</div>;
  if (!isOwner(effectiveTeam.id)) {
    return (
      <div className="container py-16 text-center body-text">
        Você precisa do código de edição da equipe pra mexer nesse veículo.
        <div className="mt-4"><Button onClick={() => navigate(-1)}>Voltar</Button></div>
      </div>
    );
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));
  const setSpec = (k: string) => (e: any) => setForm((f: any) => ({ ...f, specs: { ...f.specs, [k]: e.target.value ? Number(e.target.value) : undefined } }));
  const setHist = (k: string) => (e: any) => setForm((f: any) => ({ ...f, history: { ...f.history, [k]: e.target.value ? Number(e.target.value) : undefined } }));

  const save = async () => {
    setSaving(true);
    const token = getOwnedToken(effectiveTeam.id)!;
    const payload = {
      name: form.name, brand: form.brand, model: form.model, year: form.year, race_number: form.race_number,
      category_id: form.category_id, type: form.type, photo_url: form.photo_url,
      pilot_name: form.pilot_name, navigator_name: form.navigator_name, pilot_city: form.pilot_city,
      description: form.description, specs: form.specs, history: form.history,
    };
    if (isCreate) {
      const { data, error } = await supabase.rpc("create_vehicle", {
        p_team_id: effectiveTeam.id, p_token: token,
        p: { ...payload, slug: slugify(`${effectiveTeam.slug}-${form.name || "veiculo"}`) },
      });
      setSaving(false);
      if (error) { toast.error("Não deu pra cadastrar."); return; }
      toast.success("Veículo cadastrado!");
      navigate(`/carta/${data.slug}`);
    } else {
      const { error } = await supabase.rpc("update_vehicle", { p_vehicle_id: vehicle!.id, p_token: token, p: payload });
      setSaving(false);
      if (error) { toast.error("Não deu pra salvar."); return; }
      toast.success("Carta atualizada!");
      navigate(`/carta/${vehicle!.slug}`);
    }
  };

  const remove = async () => {
    if (!vehicle) return;
    if (!confirm("Apagar essa carta? Não dá pra desfazer.")) return;
    const token = getOwnedToken(effectiveTeam.id)!;
    const { error } = await supabase.rpc("delete_vehicle", { p_vehicle_id: vehicle.id, p_token: token });
    if (error) { toast.error("Não deu pra apagar."); return; }
    toast.success("Carta removida.");
    navigate(`/equipe/${effectiveTeam.slug}`);
  };

  return (
    <div className="container py-6 max-w-sm space-y-4">
      <h1 className="heading-lg">{isCreate ? "Novo veículo" : "Editar carta"}</h1>

      <PhotoUpload folder={`vehicles/${effectiveTeam.slug}`} value={form.photo_url} onChange={(url) => setForm((f: any) => ({ ...f, photo_url: url }))} />

      <div>
        <Label className="mb-1.5 block">Tipo</Label>
        <div className="flex gap-1.5 flex-wrap">
          {TYPE_ORDER.map((t) => (
            <button key={t} type="button"
              onClick={() => setForm((f: any) => ({ ...f, type: t, category_id: CATEGORIES.find((c) => c.type === t)!.id }))}
              className={cn("rounded-full border px-3 py-1.5 label-text !text-[10px]", form.type === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground")}>
              {TYPE_LABEL[t as VehicleType]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-1.5 block">Categoria</Label>
        <select value={form.category_id} onChange={set("category_id")} className="w-full h-11 rounded-sm border border-input bg-transparent px-3 text-sm">
          {CATEGORIES.filter((c) => c.type === form.type).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div><Label>Nome/modelo *</Label><Input value={form.name ?? ""} onChange={set("name")} className="mt-1.5" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Marca</Label><Input value={form.brand ?? ""} onChange={set("brand")} className="mt-1.5" /></div>
        <div><Label>Nº de prova</Label><Input value={form.race_number ?? ""} onChange={set("race_number")} className="mt-1.5" /></div>
      </div>
      <div><Label>Piloto</Label><Input value={form.pilot_name ?? ""} onChange={set("pilot_name")} className="mt-1.5" /></div>
      <div><Label>Navegador</Label><Input value={form.navigator_name ?? ""} onChange={set("navigator_name")} className="mt-1.5" /></div>
      <div><Label>Descrição</Label><Textarea value={form.description ?? ""} onChange={set("description")} rows={3} className="mt-1.5" /></div>

      <div>
        <p className="label-text mb-2">Especificações (opcional)</p>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="!text-[10px]">Potência (cv)</Label><Input type="number" value={form.specs?.power_cv ?? ""} onChange={setSpec("power_cv")} className="mt-1" /></div>
          <div><Label className="!text-[10px]">Torque (kgfm)</Label><Input type="number" value={form.specs?.torque_kgfm ?? ""} onChange={setSpec("torque_kgfm")} className="mt-1" /></div>
          <div><Label className="!text-[10px]">Peso (kg)</Label><Input type="number" value={form.specs?.weight_kg ?? ""} onChange={setSpec("weight_kg")} className="mt-1" /></div>
          <div><Label className="!text-[10px]">Suspensão (mm)</Label><Input type="number" value={form.specs?.suspension_mm ?? ""} onChange={setSpec("suspension_mm")} className="mt-1" /></div>
        </div>
      </div>

      <div>
        <p className="label-text mb-2">Histórico (opcional)</p>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="!text-[10px]">Sertões disputados</Label><Input type="number" value={form.history?.sertoes_count ?? ""} onChange={setHist("sertoes_count")} className="mt-1" /></div>
          <div><Label className="!text-[10px]">Títulos gerais</Label><Input type="number" value={form.history?.titles_general ?? ""} onChange={setHist("titles_general")} className="mt-1" /></div>
          <div><Label className="!text-[10px]">Títulos categoria</Label><Input type="number" value={form.history?.titles_category ?? ""} onChange={setHist("titles_category")} className="mt-1" /></div>
          <div><Label className="!text-[10px]">Pódios</Label><Input type="number" value={form.history?.podiums ?? ""} onChange={setHist("podiums")} className="mt-1" /></div>
        </div>
      </div>

      <Button className="w-full" onClick={save} disabled={saving || !form.name}>{saving ? "Salvando..." : isCreate ? "Cadastrar veículo" : "Salvar alterações"}</Button>
      {!isCreate && (
        <Button variant="outline" className="w-full gap-1.5 text-destructive" onClick={remove}>
          <Trash2 className="h-3.5 w-3.5" /> Apagar carta
        </Button>
      )}
    </div>
  );
}
