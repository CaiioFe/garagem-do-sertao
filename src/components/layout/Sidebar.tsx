import { Link, NavLink } from "react-router-dom";
import { Home, Users, LayoutGrid, Flag, BookOpen, Plane, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Início", icon: Home, end: true },
  { to: "/equipes", label: "Equipes", icon: Users },
  { to: "/cartas", label: "Veículos", icon: LayoutGrid },
  { to: "/resultados", label: "Resultados", icon: Flag },
  { to: "/guia", label: "Guia", icon: BookOpen },
  { to: "/expedicoes", label: "Expedições", icon: Plane },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-56 flex-col surface-elevated border-r border-border px-4 py-6">
      <Link to="/" className="flex items-center gap-2 mb-8 px-2">
        <span className="h-8 w-8 rounded-sm stripes shrink-0" />
        <span className="font-display font-extrabold uppercase italic tracking-tight text-base leading-[1.05]">
          Garagem<br /><span className="text-primary">do Sertão</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <Link
        to="/cadastrar"
        className="flex items-center justify-center gap-1.5 rounded-md bg-primary text-primary-foreground text-sm font-bold py-2.5 hover:opacity-90 transition-opacity"
      >
        <Plus className="h-4 w-4" /> Cadastrar equipe
      </Link>
    </aside>
  );
}
