import { Link } from "react-router-dom";
import { useVehicles } from "@/hooks/useVehicles";
import { useTeams } from "@/hooks/useTeams";
import { TrunfoCard } from "@/components/card/TrunfoCard";
import { InstallBanner } from "@/components/common/InstallBanner";
import { Button } from "@/components/ui/button";
import { EVENT } from "@/data/stages";
import { PARTNERS } from "@/data/partners";
import { dayOfIndex } from "@/lib/trunfo";
import { todayISO, daysUntil } from "@/lib/dates";
import { Users, LayoutGrid, BookOpen, Plane, Sparkles, Trophy, Flag, Droplets } from "lucide-react";

export default function Home() {
  const { data: vehicles } = useVehicles();
  const { data: teams } = useTeams();
  const total = vehicles?.length ?? 0;
  const latest = [...(vehicles ?? [])].sort((a, b) => b.card_number - a.card_number).slice(0, 4);
  const dayVehicle = total > 0 ? vehicles![dayOfIndex(todayISO(), total)] : null;
  const dLargada = daysUntil(EVENT.start);
  const partner = PARTNERS.find((p) => p.featured);
  const ranked = [...(vehicles ?? [])]
    .filter((v) => typeof v.result?.position_general === "number")
    .sort((a, b) => a.result!.position_general! - b.result!.position_general!);
  const topResult = ranked[0];

  return (
    <div className="pb-4">
      <section className="container pt-6 pb-5">
        <p className="label-text text-primary mb-1">Não oficial · feito por fãs</p>
        <h1 className="heading-xl">
          Garagem <span className="text-primary">dos Sertões</span>
        </h1>
        <p className="body-text mt-2 max-w-md">
          As equipes e os veículos do {EVENT.name}. Conheça quem está correndo e acompanhe a prova.
        </p>

        <div className="surface-elevated rounded-lg p-4 mt-5">
          {dLargada > 0 ? (
            <>
              <p className="label-text text-primary">Faltam {dLargada} dia{dLargada === 1 ? "" : "s"}</p>
              <p className="font-display font-bold uppercase italic text-lg leading-tight mt-0.5">
                Largada em {EVENT.startCity}
              </p>
            </>
          ) : dLargada === 0 ? (
            <>
              <p className="label-text text-primary">Hoje</p>
              <p className="font-display font-bold uppercase italic text-lg leading-tight mt-0.5">
                Prólogo e Super Prime · Citàge Santé, 7h e 14h
              </p>
            </>
          ) : (
            <>
              <p className="label-text text-primary">Rolando agora</p>
              <p className="font-display font-bold uppercase italic text-lg leading-tight mt-0.5">
                {EVENT.name} em andamento
              </p>
            </>
          )}
          <Link to="/guia" className="inline-block mt-2 text-xs font-semibold text-primary underline underline-offset-2">
            ver programação completa
          </Link>
        </div>
      </section>

      <InstallBanner />

      <section className="container mb-6">
        <div className="grid grid-cols-5 gap-2">
          <QuickLink to="/equipes" icon={Users} label="Equipes" />
          <QuickLink to="/cartas" icon={LayoutGrid} label="Veículos" />
          <QuickLink to="/resultados" icon={Flag} label="Resultados" />
          <QuickLink to="/guia" icon={BookOpen} label="Guia" />
          <QuickLink to="/expedicoes" icon={Plane} label="Expedições" />
        </div>
      </section>

      {teams && teams.length > 0 && (
        <section className="mb-6">
          <div className="container flex items-center justify-between mb-1">
            <h2 className="heading-md !text-base">Equipes cadastradas</h2>
            <Link to="/equipes" className="caption-text text-primary shrink-0">ver todas</Link>
          </div>
          <p className="container caption-text !text-xs mb-2">Times reais do {EVENT.name}, com foto e histórico de cada carro.</p>
          <div className="container flex gap-2 overflow-x-auto no-scrollbar">
            {teams.slice(0, 8).map((t) => (
              <Link
                key={t.id}
                to={`/equipe/${t.slug}`}
                className="shrink-0 surface-card rounded-full pl-2 pr-3.5 py-2 flex items-center gap-2"
              >
                <span className="h-6 w-6 rounded-full bg-white overflow-hidden shrink-0 flex items-center justify-center">
                  {t.logo_url ? (
                    <img src={t.logo_url} alt="" className="h-full w-full object-contain" loading="lazy" />
                  ) : (
                    <Users className="h-3 w-3 text-background/50" />
                  )}
                </span>
                <span className="text-xs font-semibold whitespace-nowrap">{t.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mb-6">
        <div className="surface-card rounded-lg p-4 text-center">
          <p className="font-display font-bold uppercase italic text-lg">Sua equipe está no rally?</p>
          <p className="body-text !text-sm mt-1">Cadastre seus veículos e conte a história da sua equipe.</p>
          <Link to="/cadastrar"><Button className="mt-3">Cadastrar equipe</Button></Link>
        </div>
      </section>

      {topResult && (
        <section className="container mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="label-text text-primary flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              {topResult.result?.stage_label === "Final" ? "Como terminamos" : "Como estamos indo"}
            </p>
            <Link to="/resultados" className="caption-text text-primary shrink-0">ver todos</Link>
          </div>
          <Link
            to={`/carta/${topResult.slug}`}
            className="relative overflow-hidden surface-elevated ring-1 ring-[hsl(var(--rarity-lendaria))]/50 rounded-lg p-3 flex items-center gap-3"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{ background: "radial-gradient(circle at 0% 0%, hsl(var(--rarity-lendaria)), transparent 60%)" }}
            />
            <div className="relative h-11 w-11 rounded-full shrink-0 flex items-center justify-center font-display font-black italic text-base leading-none bg-[hsl(var(--rarity-lendaria))] text-background">
              {topResult.result!.position_general}º
            </div>
            <div className="relative min-w-0 flex-1">
              <p className="font-display font-bold uppercase italic text-sm leading-tight truncate">{topResult.name}</p>
              <p className="caption-text !text-[11px] truncate">
                {topResult.teams?.name}
                {topResult.result!.category_code ? ` · ${topResult.result!.category_code}` : ""}
              </p>
            </div>
            <span className="relative label-text !text-[9px] text-[hsl(var(--rarity-lendaria))]">
              {topResult.result!.position_general === 1 ? "líder" : "melhor colocado"}
            </span>
          </Link>
        </section>
      )}

      {dayVehicle && (
        <section className="container mb-6">
          <p className="label-text text-primary mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Veículo do dia
          </p>
          <Link to={`/carta/${dayVehicle.slug}`} className="block max-w-[220px]">
            <TrunfoCard vehicle={dayVehicle} totalCount={total} interactive={false} />
          </Link>
        </section>
      )}

      {latest.length > 0 && (
        <section className="mb-6">
          <div className="container flex items-center justify-between mb-2">
            <h2 className="heading-md !text-base">Últimos veículos</h2>
            <Link to="/cartas" className="caption-text text-primary">ver todos</Link>
          </div>
          <div className="container flex gap-3 overflow-x-auto no-scrollbar">
            {latest.map((v) => (
              <Link key={v.id} to={`/carta/${v.slug}`} className="w-[42vw] shrink-0 max-w-[180px]">
                <TrunfoCard vehicle={v} totalCount={total} interactive={false} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {partner && (
        <section className="container mb-6">
          <p className="label-text mb-2 flex items-center gap-1.5"><Plane className="h-3.5 w-3.5" /> Vai de expedição</p>
          <Link to="/expedicoes" className="surface-card rounded-lg p-3 block">
            <p className="font-semibold text-sm">{partner.name}</p>
            <p className="caption-text !text-xs mt-0.5">{partner.tagline}</p>
          </Link>
        </section>
      )}

      <section className="container mb-6">
        <p className="label-text mb-2 flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5" /> Impacto socioambiental</p>
        <div className="surface-card rounded-lg p-3">
          <p className="font-semibold text-sm">Instituto Sertões</p>
          <p className="body-text !text-sm mt-1.5">
            Desde 2022 o Instituto Sertões leva água potável, educação ambiental e ações sociais pras
            comunidades no caminho do rally. Na edição 2026, a parceria com a Conasa Infraestrutura
            distribuiu 520 filtros ConÁgua pra famílias de Goiás e Tocantins.
          </p>
          <a
            href="https://www.vidamaissustentavel.com.br/2026/08/22/empresa-entregara-520-filtros-solidarios-durante-o-sertoes-2026/"
            target="_blank"
            rel="noreferrer"
            className="caption-text !text-xs mt-2 inline-block text-primary underline underline-offset-2"
          >
            fonte: Vida Mais Sustentável
          </a>
        </div>
      </section>

      <footer className="container py-6 text-center">
        <p className="caption-text !text-[11px]">
          Garagem dos Sertões é um projeto independente, não oficial, feito por fãs. Não tem vínculo com a organização do rally.
        </p>
      </footer>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="surface-card rounded-lg flex flex-col items-center justify-center gap-1.5 py-3.5">
      <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
      <span className="label-text !text-[9px]">{label}</span>
    </Link>
  );
}
