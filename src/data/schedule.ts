export interface ScheduleItem { date: string; time: string; title: string; place: string; kind: "vila" | "prova" | "show" }

export const SCHEDULE: ScheduleItem[] = [
  { date: "2026-08-19", time: "10h às 21h", title: "Vila Sertões aberta ao público", place: "Autódromo Ayrton Senna, Goiânia", kind: "vila" },
  { date: "2026-08-20", time: "14h", title: "Concurso de Artes", place: "Vila Sertões", kind: "show" },
  { date: "2026-08-20", time: "15h", title: "Carreata oficial", place: "Goiânia", kind: "show" },
  { date: "2026-08-21", time: "10h às 21h", title: "Último dia da Vila pré-largada", place: "Autódromo Ayrton Senna", kind: "vila" },
  { date: "2026-08-22", time: "7h às 13h", title: "Largada promocional + Prólogo", place: "Condomínio Citàge Santé, GO-020", kind: "prova" },
  { date: "2026-08-22", time: "14h às 17h30", title: "Super Prime (baterias eliminatórias)", place: "Condomínio Citàge Santé, GO-020", kind: "prova" },
  { date: "2026-08-23", time: "manhã", title: "Largada da Etapa 1 rumo a Cavalcante", place: "Goiânia", kind: "prova" },
  { date: "2026-08-30", time: "8h", title: "Chegada promocional das expedições", place: "Vila Sertões", kind: "vila" },
  { date: "2026-08-30", time: "11h às 17h30", title: "Chegada dos competidores", place: "Autódromo Ayrton Senna", kind: "prova" },
  { date: "2026-08-30", time: "19h", title: "Premiação geral e por categorias", place: "Vila Sertões", kind: "show" },
];
