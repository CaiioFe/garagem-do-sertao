import { Link } from "react-router-dom";
import { useTeams } from "@/hooks/useTeams";
import { Users } from "lucide-react";

export default function Teams() {
  const { data: teams, isLoading } = useTeams();

  return (
    <div className="container py-6">
      <h1 className="heading-lg mb-1">Equipes</h1>
      <p className="body-text mb-5">{teams?.length ?? 0} equipes cadastradas.</p>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-lg surface-card animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {teams?.map((t) => (
            <Link key={t.id} to={`/equipe/${t.slug}`} className="surface-card rounded-lg p-3 flex items-center gap-3 hover:surface-elevated transition-colors">
              <div className="h-14 w-14 rounded-md overflow-hidden shrink-0 bg-white flex items-center justify-center p-1.5">
                {t.logo_url ? (
                  <img src={t.logo_url} alt={t.name} className="h-full w-full object-contain" loading="lazy" />
                ) : (
                  <Users className="h-6 w-6 text-muted-foreground/40" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold uppercase italic text-base leading-tight truncate">{t.name}</p>
                <p className="caption-text !text-xs truncate">{[t.city, t.state].filter(Boolean).join(" · ") || "Cidade não informada"}</p>
                {!t.verified && (
                  <span className="inline-block mt-1 rounded-sm bg-accent/15 text-accent px-1.5 py-0.5 label-text !text-[8px]">
                    não confirmada
                  </span>
                )}
              </div>

            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
