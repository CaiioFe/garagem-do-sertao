import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slug";
import { setOwnedToken } from "@/lib/storage";
import { CATEGORIES, TYPE_LABEL, TYPE_ORDER, type VehicleType } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/forms/PhotoUpload";
import { Copy, Check, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ teamId: string; teamSlug: string; token: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // equipe
  const [teamName, setTeamName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [teamDesc, setTeamDesc] = useState("");

  // veículo
  const [vType, setVType] = useState<VehicleType>("carro");
  const [categoryId, setCategoryId] = useState(CATEGORIES.find((c) => c.type === "carro")!.id);
  const [vName, setVName] = useState("");
  const [pilotName, setPilotName] = useState("");
  const [navigatorName, setNavigatorName] = useState("");

  // foto
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const canStep1 = teamName.trim().length >= 2;
  const canStep2 = vName.trim().length >= 2 && pilotName.trim().length >= 2;

  const submit = async () => {
    setSaving(true);
    try {
      const { data: teamData, error: teamErr } = await supabase.rpc("create_team", {
        p: { slug: slugify(teamName), name: teamName, city, state, instagram, whatsapp, description: teamDesc },
      });
      if (teamErr) throw teamErr;
      const teamId = teamData.id as string;
      const teamSlug = teamData.slug as string;
      const token = teamData.edit_token as string;

      const { error: vErr } = await supabase.rpc("create_vehicle", {
        p_team_id: teamId,
        p_token: token,
        p: { slug: slugify(`${teamSlug}-${vName}`), name: vName, category_id: categoryId, type: vType, pilot_name: pilotName, navigator_name: navigatorName, photo_url: photoUrl },
      });
      if (vErr) throw vErr;

      setOwnedToken(teamId, token);
      setResult({ teamId, teamSlug, token });
    } catch (e) {
      console.error(e);
      toast.error("Não deu pra cadastrar. Tenta de novo?");
    } finally {
      setSaving(false);
    }
  };

  if (result) {
    const wa = `https://wa.me/?text=${encodeURIComponent(`Meu código de edição da Garagem dos Sertões: ${result.token}\n${window.location.origin}/equipe/${result.teamSlug}`)}`;
    return (
      <div className="container py-10 max-w-sm text-center">
        <PartyPopper className="h-12 w-12 text-primary mx-auto mb-3" />
        <h1 className="heading-lg">Equipe cadastrada!</h1>
        <p className="body-text mt-2">Guarde esse código. É ele que te deixa editar a equipe depois, em qualquer aparelho.</p>
        <div className="surface-elevated rounded-lg p-4 mt-5 flex items-center justify-between">
          <span className="font-mono text-2xl font-bold tracking-wider">{result.token}</span>
          <Button
            variant="secondary" size="sm"
            onClick={() => { navigator.clipboard.writeText(result.token); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <a href={wa} target="_blank" rel="noreferrer">
          <Button variant="secondary" className="w-full mt-3">Mandar código pra mim no WhatsApp</Button>
        </a>
        <Button className="w-full mt-3" onClick={() => navigate(`/equipe/${result.teamSlug}`)}>Ver minha equipe</Button>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-sm">
      <div className="flex items-center gap-1.5 mb-5">
        {[1, 2, 3].map((s) => (
          <div key={s} className={cn("h-1 flex-1 rounded-full", s <= step ? "bg-primary" : "bg-muted")} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h1 className="heading-lg">Sua equipe</h1>
          <div>
            <Label>Nome da equipe *</Label>
            <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Ex: Fifi Rally Team" className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Cidade</Label><Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Estado</Label><Input value={state} onChange={(e) => setState(e.target.value)} maxLength={2} className="mt-1.5" /></div>
          </div>
          <div>
            <Label>Instagram (sem @)</Label>
            <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="55629..." className="mt-1.5" />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} rows={3} className="mt-1.5" />
          </div>
          <Button className="w-full" disabled={!canStep1} onClick={() => setStep(2)}>Continuar</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h1 className="heading-lg">Primeiro veículo</h1>
          <div>
            <Label className="mb-1.5 block">Tipo</Label>
            <div className="flex gap-1.5 flex-wrap">
              {TYPE_ORDER.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setVType(t); setCategoryId(CATEGORIES.find((c) => c.type === t)!.id); }}
                  className={cn("rounded-full border px-3 py-1.5 label-text !text-[10px]", vType === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground")}
                >
                  {TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-1.5 block">Categoria</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 rounded-sm border border-input bg-transparent px-3 text-sm"
            >
              {CATEGORIES.filter((c) => c.type === vType).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Nome/modelo do veículo *</Label>
            <Input value={vName} onChange={(e) => setVName(e.target.value)} placeholder="Ex: Century CR7" className="mt-1.5" />
          </div>
          <div>
            <Label>Piloto *</Label>
            <Input value={pilotName} onChange={(e) => setPilotName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Navegador</Label>
            <Input value={navigatorName} onChange={(e) => setNavigatorName(e.target.value)} className="mt-1.5" />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>Voltar</Button>
            <Button className="flex-1" disabled={!canStep2} onClick={() => setStep(3)}>Continuar</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h1 className="heading-lg">Foto do veículo</h1>
          <p className="body-text !text-sm">Capriche, é a primeira coisa que aparece no perfil. Pode adicionar depois também.</p>
          <PhotoUpload folder="pending" value={photoUrl} onChange={setPhotoUrl} label="Foto do veículo" />
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>Voltar</Button>
            <Button className="flex-1" onClick={submit} disabled={saving}>{saving ? "Salvando..." : "Finalizar cadastro"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
