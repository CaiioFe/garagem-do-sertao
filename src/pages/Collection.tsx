import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCollection } from "@/lib/storage";
import { useVehicles } from "@/hooks/useVehicles";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { Button } from "@/components/ui/button";
import { Share2, Layers } from "lucide-react";
import { toast } from "sonner";

export default function Collection() {
  const { data: vehicles } = useVehicles();
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromLink = params.get("c");
    if (fromLink) {
      const list = fromLink.split(",").filter(Boolean);
      list.forEach((s) => {
        const arr = getCollection();
        if (!arr.includes(s)) {
          localStorage.setItem("tds_collection", JSON.stringify([...arr, s]));
        }
      });
    }
    setSlugs(getCollection());
  }, []);

  const owned = (vehicles ?? []).filter((v) => slugs.includes(v.slug));
  const total = vehicles?.length ?? 0;

  const backupLink = () => {
    const url = `${window.location.origin}/colecao?c=${slugs.join(",")}`;
    navigator.clipboard.writeText(url);
    toast.success("Link da coleção copiado! Manda pra você mesmo no WhatsApp.");
  };

  return (
    <div className="container py-6">
      <h1 className="heading-lg mb-1">Minha coleção</h1>
      <p className="body-text mb-3">{owned.length} de {total} cartas colecionadas.</p>

      <div className="h-2 rounded-full bg-muted overflow-hidden mb-5">
        <div className="h-full bg-primary transition-all" style={{ width: `${total ? (owned.length / total) * 100 : 0}%` }} />
      </div>

      {owned.length > 0 && (
        <Button variant="secondary" size="sm" className="gap-2 mb-5" onClick={backupLink}>
          <Share2 className="h-3.5 w-3.5" /> Salvar link de backup da coleção
        </Button>
      )}

      {owned.length === 0 ? (
        <div className="text-center py-16">
          <Layers className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="body-text">Sua coleção está vazia.</p>
          <p className="caption-text mt-1">Escaneie o QR de uma carta na Vila pra começar a colecionar.</p>
          <Link to="/cartas"><Button className="mt-4">Ver todas as cartas</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {owned.map((v) => (
            <Link key={v.id} to={`/carta/${v.slug}`}>
              <TrunfoCard vehicle={v} totalCount={total} interactive={false} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
