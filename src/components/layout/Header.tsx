import { Link } from "react-router-dom";
import { Plus, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 surface-elevated/95 backdrop-blur border-b border-border safe-top">
      <div className="container flex h-16 items-center justify-between md:justify-end">
        <Link to="/" className="flex items-center gap-2 md:hidden">
          <span className="h-7 w-7 rounded-sm stripes shrink-0" />
          <span className="font-display font-extrabold uppercase italic tracking-tight text-lg leading-none">
            Garagem <span className="text-primary">do Sertão</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/qr">
            <Button variant="ghost" size="sm" className="px-2.5">
              <QrCode className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/cadastrar">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
