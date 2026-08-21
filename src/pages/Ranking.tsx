import { Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useVehicles";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Ranking() {
  const { data: vehicles, isLoading } = useVehicles();
  const ranked = [...(vehicles ?? [])].sort((a, b) => b.likes_count - a.likes_count);

  return (
    <div className="container py-6">
      <h1 className="heading-lg mb-1">Ranking</h1>
      <p className="body-text mb-5">As cartas mais curtidas da Vila Sertões.</p>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 rounded-lg surface-card animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {ranked.map((v, i) => (
            <Link key={v.id} to={`/carta/${v.slug}`} className="surface-card rounded-lg p-3 flex items-center gap-3">
              <span className={cn("num text-xl font-black w-7 text-center shrink-0", i < 3 ? "text-primary" : "text-muted-foreground")}>{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{v.name}</p>
                <p className="caption-text !text-xs truncate">{v.teams?.name}</p>
              </div>
              <span className="flex items-center gap-1 shrink-0 num text-sm font-bold">
                <Heart className="h-3.5 w-3.5 text-primary" /> {v.likes_count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
