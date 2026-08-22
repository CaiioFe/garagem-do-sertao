import { PARTNERS, EXPEDITIONS_OFFICIAL_URL } from "@/data/partners";
import { trackView } from "@/lib/track";
import { ExternalLink, Instagram } from "lucide-react";

export default function Expeditions() {
  const featured = PARTNERS.filter((p) => p.featured);
  const rest = PARTNERS.filter((p) => !p.featured);

  return (
    <div className="container py-6">
      <h1 className="heading-lg">Expedições</h1>
      <p className="body-text mt-1 mb-5">
        Operadores homologados que acompanham o rally, sem cronometragem, junto com competidores e equipes.
      </p>

      <div className="space-y-4 mb-8">
        {featured.map((p) => (
          <div key={p.id} className="surface-elevated rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-1">
              <h3 className="heading-md !text-base">{p.name}</h3>
              {p.city && <span className="label-text">{p.city}</span>}
            </div>
            <p className="body-text !text-sm">{p.tagline}</p>
            {p.description && <p className="caption-text mt-2">{p.description}</p>}
            <div className="flex items-center gap-3 mt-3">
              {p.site && (
                <a href={p.site} target="_blank" rel="noreferrer" onClick={() => trackView("partner", p.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Site <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {p.instagram && (
                <a href={`https://instagram.com/${p.instagram}`} target="_blank" rel="noreferrer" onClick={() => trackView("partner", p.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  <Instagram className="h-3 w-3" /> @{p.instagram}
                </a>
              )}
              {p.dates && <span className="caption-text !text-xs ml-auto">{p.dates}</span>}
            </div>
          </div>
        ))}
      </div>

      <h2 className="label-text mb-2">Outros operadores homologados</h2>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {rest.map((p) => (
          <div key={p.id} className="surface-card rounded-lg p-3">
            <p className="text-sm font-semibold leading-tight">{p.name}</p>
            {p.site && (
              <a href={p.site} target="_blank" rel="noreferrer" onClick={() => trackView("partner", p.id)} className="caption-text !text-[11px] text-primary">
                visitar site
              </a>
            )}
          </div>
        ))}
      </div>

      <a href={EXPEDITIONS_OFFICIAL_URL} target="_blank" rel="noreferrer" className="caption-text underline">
        Programa oficial Expedições Sertões ↗
      </a>
    </div>
  );
}
