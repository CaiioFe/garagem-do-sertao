import { NavLink } from "react-router-dom";
import { Home, Users, LayoutGrid, Flag, BookOpen, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Início", icon: Home, end: true },
  { to: "/equipes", label: "Equipes", icon: Users },
  { to: "/cartas", label: "Veículos", icon: LayoutGrid },
  { to: "/resultados", label: "Resultados", icon: Flag },
  { to: "/guia", label: "Guia", icon: BookOpen },
  { to: "/expedicoes", label: "Expedições", icon: Plane },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 surface-elevated border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-6">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-stretch justify-center gap-1 py-2.5 px-0.5 min-w-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <Icon className="h-5 w-5 mx-auto shrink-0" strokeWidth={2.2} />
            <span className="label-text !text-[8px] !tracking-normal text-center leading-[1.05] px-px break-words">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
