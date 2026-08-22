import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, Scale, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/cartas", label: "Cartas", icon: LayoutGrid },
  { to: "/equipes", label: "Equipes", icon: Users },
  { to: "/duelo", label: "Comparar", icon: Scale },
  { to: "/ranking", label: "Ranking", icon: Trophy },
  { to: "/guia", label: "Guia", icon: BookOpen },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 surface-elevated border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
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
