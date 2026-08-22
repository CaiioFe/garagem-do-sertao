import { useEffect, useState } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasDeferredPrompt, onInstallPromptChange, isStandalone, isIOS, promptInstall } from "@/lib/pwa";

const DISMISS_KEY = "install_banner_dismissed";

export function InstallBanner() {
  const [canInstall, setCanInstall] = useState(hasDeferredPrompt());
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === "1");
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const ios = isIOS();

  useEffect(() => onInstallPromptChange(() => setCanInstall(hasDeferredPrompt())), []);

  if (isStandalone() || dismissed) return null;
  if (!canInstall && !ios) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const handleClick = async () => {
    if (ios) {
      setShowIOSHelp(true);
      return;
    }
    const accepted = await promptInstall();
    if (accepted) dismiss();
  };

  return (
    <>
      <div className="container mb-4">
        <div className="surface-elevated rounded-lg p-3 flex items-center gap-3 border border-primary/20">
          <div className="h-9 w-9 rounded-md stripes shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">Instale o app</p>
            <p className="caption-text !text-xs">Acesso direto da tela inicial, sem abrir o navegador.</p>
          </div>
          <Button size="sm" onClick={handleClick} className="gap-1.5 shrink-0">
            <Download className="h-3.5 w-3.5" /> Instalar
          </Button>
          <button onClick={dismiss} aria-label="Fechar" className="shrink-0 text-muted-foreground p-1 -mr-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showIOSHelp && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/90 backdrop-blur-sm p-4"
          onClick={() => setShowIOSHelp(false)}
        >
          <div className="surface-elevated rounded-lg p-5 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <p className="heading-md !text-base mb-4">Adicionar à Tela de Início</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">1</span>
                <p className="body-text !text-sm flex items-center gap-1.5">
                  Toque no ícone de compartilhar <Share className="h-4 w-4 text-primary shrink-0" /> na barra do Safari
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">2</span>
                <p className="body-text !text-sm flex items-center gap-1.5">
                  Escolha <strong>Adicionar à Tela de Início</strong> <SquarePlus className="h-4 w-4 text-primary shrink-0" />
                </p>
              </div>
            </div>
            <Button className="w-full mt-5" onClick={() => { setShowIOSHelp(false); dismiss(); }}>Entendi</Button>
          </div>
        </div>
      )}
    </>
  );
}
