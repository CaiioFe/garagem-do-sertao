export interface Stage { n: number; date: string; label: string; from: string; to: string; km: number; special: number; note?: string }

export const STAGES: Stage[] = [
  { n: 0, date: "2026-08-22", label: "Prólogo + Super Prime", from: "Goiânia (GO)", to: "Goiânia (GO)", km: 0, special: 0, note: "Condomínio Citàge Santé, GO-020. Prólogo 7h às 13h, Super Prime 14h às 17h30." },
  { n: 1, date: "2026-08-23", label: "Etapa 1", from: "Goiânia (GO)", to: "Cavalcante (GO)", km: 650, special: 342, note: "Chapada dos Veadeiros." },
  { n: 2, date: "2026-08-24", label: "Etapa 2", from: "Cavalcante (GO)", to: "Luís Eduardo Magalhães (BA)", km: 635, special: 435 },
  { n: 3, date: "2026-08-25", label: "Etapa 3", from: "Luís Eduardo Magalhães (BA)", to: "Mateiros (TO)", km: 544, special: 501, note: "Jalapão. Começa a Maratona: sem assistência externa." },
  { n: 4, date: "2026-08-26", label: "Etapa 4", from: "Mateiros (TO)", to: "Porto Nacional (TO)", km: 572, special: 304, note: "Metade da prova, início do retorno." },
  { n: 5, date: "2026-08-27", label: "Etapa 5", from: "Porto Nacional (TO)", to: "Minaçu (GO)", km: 563, special: 309 },
  { n: 6, date: "2026-08-28", label: "Etapa 6", from: "Minaçu (GO)", to: "Niquelândia (GO)", km: 419, special: 324 },
  { n: 7, date: "2026-08-29", label: "Etapa 7", from: "Niquelândia (GO)", to: "Goianésia (GO)", km: 321, special: 287 },
  { n: 8, date: "2026-08-30", label: "Etapa 8 (final)", from: "Goianésia (GO)", to: "Goiânia (GO)", km: 280, special: 126, note: "Chegada no Autódromo Ayrton Senna. Premiação às 19h." },
];

export const EVENT = {
  name: "Sertões 2026",
  edition: "34ª edição",
  start: "2026-08-22",
  end: "2026-08-30",
  startCity: "Goiânia (GO)",
  totalKm: "~4.000 km",
  specialKm: "~2.600 km cronometrados",
  vehicles: 146,
  competitors: 248,
  states: "GO, BA e TO",
  vila: "Autódromo Internacional Ayrton Senna, Goiânia",
  vilaHours: "19 a 22/08, das 10h às 21h, entrada gratuita",
  prologue: "22/08, Condomínio Citàge Santé (GO-020): Prólogo 7h às 13h e Super Prime 14h às 17h30. Ingresso solidário: 2 kg de alimento.",
  finish: "30/08: Vila das 8h às 22h, competidores chegam das 11h às 17h30, premiação às 19h.",
};
