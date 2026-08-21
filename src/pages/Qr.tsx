import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function Qr() {
  const url = typeof window !== "undefined" ? window.location.origin : "";

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Trunfo do Sertão", text: "As cartas colecionáveis do rally 2026", url });
      } catch { /* cancelado */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    }
  };

  return (
    <div className="container py-10 flex flex-col items-center text-center gap-6 max-w-sm">
      <div>
        <h1 className="heading-lg">Compartilhe o app</h1>
        <p className="body-text mt-1">Mostre esse QR na barraca da equipe ou manda o link direto.</p>
      </div>
      <div className="surface-card rounded-lg p-6">
        <QRCodeSVG value={url} size={220} bgColor="transparent" fgColor="hsl(36, 20%, 95%)" level="M" includeMargin={false} />
      </div>
      <Button onClick={share} className="gap-2 w-full"><Share2 className="h-4 w-4" /> Compartilhar</Button>
      <p className="caption-text break-all">{url}</p>
    </div>
  );
}
