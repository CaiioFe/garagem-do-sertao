import { NavLink } from "react-router-dom";
import { Home, Users, LayoutGrid, BookOpen, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Início", icon: Home, end: true },
  { to: "/equipes", label: "Equipes", icon: Users },
  { to: "/cartas", label: "Veículos", icon: LayoutGrid },
  { to: "/guia", label: "Guia", icon: BookOpen },
  { to: "/expedicoes", label: "Expedições", icon: Plane },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 surface-elevated border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <Icon className="h-5 w-5" strokeWidth={2.2} />
            <span className="label-text !text-[9px]">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
