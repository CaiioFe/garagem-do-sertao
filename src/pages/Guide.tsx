import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EVENT, STAGES } from "@/data/stages";
import { SCHEDULE } from "@/data/schedule";
import { GLOSSARY } from "@/data/glossary";
import { CATEGORIES, TYPE_LABEL, TYPE_ORDER } from "@/data/categories";
import { formatDateBR, todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { MapPin, Flag, Sparkles } from "lucide-react";

export default function Guide() {
  const [tab, setTab] = useState("programacao");
  const today = todayISO();

  return (
    <div className="container py-6 pb-4">
      <h1 className="heading-lg">Guia do Sertões</h1>
      <p className="body-text mt-1 mb-5">{EVENT.edition} · {EVENT.states} · {EVENT.totalKm}, {EVENT.specialKm}</p>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-4 mb-5">
          <TabsTrigger value="programacao">Programação</TabsTrigger>
          <TabsTrigger value="etapas">Etapas</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="glossario">Glossário</TabsTrigger>
        </TabsList>

        <TabsContent value="programacao" className="space-y-2.5">
          {SCHEDULE.map((s, i) => {
            const isToday = s.date === today;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg p-3 flex gap-3",
                  isToday ? "surface-elevated border border-primary glow-primary" : "surface-card",
                )}
              >
                <div className="shrink-0 w-12 text-center">
                  <div className="font-display font-bold text-lg leading-none text-primary">{formatDateBR(s.date)}</div>
                  <div className="label-text !text-[8px] mt-0.5">{s.time}</div>
                </div>
                <div className="min-w-0 flex-1">
                  {isToday && (
                    <p className="label-text !text-[9px] text-primary flex items-center gap-1 mb-0.5">
                      <Sparkles className="h-3 w-3" /> Hoje
                    </p>
                  )}
                  <p className="font-semibold text-sm leading-tight">{s.title}</p>
                  <p className="caption-text !text-xs flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3 shrink-0" />{s.place}</p>
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="etapas" className="space-y-2.5">
          {STAGES.map((s) => {
            const isToday = s.date === today;
            return (
              <div
                key={s.n}
                className={cn(
                  "rounded-lg p-3",
                  isToday ? "surface-elevated border border-primary glow-primary" : "surface-card",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="label-text text-primary flex items-center gap-1"><Flag className="h-3 w-3" />{s.label}</span>
                  <span className="num text-xs text-muted-foreground">{formatDateBR(s.date)}</span>
                </div>
                {isToday && (
                  <p className="label-text !text-[9px] text-primary flex items-center gap-1 mb-1">
                    <Sparkles className="h-3 w-3" /> Rolando hoje
                  </p>
                )}
                <p className="text-sm font-medium">{s.from} → {s.to}</p>
                <p className="caption-text !text-xs mt-0.5">{s.km} km totais · {s.special} km cronometrados</p>
                {s.note && <p className="caption-text !text-xs mt-1 text-primary/80">{s.note}</p>}
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          {TYPE_ORDER.map((type) => (
            <div key={type}>
              <h3 className="label-text text-primary mb-2">{TYPE_LABEL[type]}</h3>
              <div className="space-y-2">
                {CATEGORIES.filter((c) => c.type === type).map((c) => (
                  <div key={c.id} className="surface-card rounded-lg p-3">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="caption-text !text-xs mt-0.5">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="glossario" className="space-y-2">
          {GLOSSARY.map((g) => (
            <div key={g.slug} className="surface-card rounded-lg p-3">
              <p className="font-display font-bold uppercase text-sm text-primary">{g.term}</p>
              <p className="caption-text !text-xs mt-1">{g.def}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
