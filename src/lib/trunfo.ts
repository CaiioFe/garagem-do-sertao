import { CATEGORY_BY_ID, type Category } from "@/data/categories";

export interface VehicleSpecs {
  power_cv?: number;
  torque_kgfm?: number;
  weight_kg?: number;
  suspension_mm?: number;
  tank_l?: number;
}

export interface VehicleHistory {
  sertoes_count?: number;
  titles_general?: number;
  titles_category?: number;
  stage_wins?: number;
  podiums?: number;
}

export interface Fact {
  key: string;
  label: string;
}

// Só entra aqui o que é fato real (histórico pesquisado ou informado pela própria equipe).
// Nunca inventa número pra "preencher" um card.
export function getFacts(history: VehicleHistory): Fact[] {
  const facts: Fact[] = [];
  if (history.titles_general) {
    facts.push({ key: "titles_general", label: `${history.titles_general}x campeão geral do Sertões` });
  }
  if (history.titles_category) {
    facts.push({ key: "titles_category", label: `${history.titles_category}x campeão de categoria` });
  }
  if (history.podiums) {
    facts.push({ key: "podiums", label: `${history.podiums} pódio${history.podiums > 1 ? "s" : ""}` });
  }
  if (history.stage_wins) {
    facts.push({ key: "stage_wins", label: `${history.stage_wins} vitória${history.stage_wins > 1 ? "s" : ""} de etapa` });
  }
  if (history.sertoes_count) {
    facts.push({ key: "sertoes_count", label: `${history.sertoes_count}ª participação no Sertões` });
  }
  return facts;
}

// Specs só aparecem se a própria equipe informou (não tem valor "padrão" inventado).
export function getSpecRows(specs: VehicleSpecs): { key: string; label: string; value: string }[] {
  const rows: { key: string; label: string; value: string }[] = [];
  if (specs.power_cv) rows.push({ key: "power", label: "Potência", value: `${specs.power_cv} cv` });
  if (specs.torque_kgfm) rows.push({ key: "torque", label: "Torque", value: `${specs.torque_kgfm} kgfm` });
  if (specs.weight_kg) rows.push({ key: "weight", label: "Peso", value: `${specs.weight_kg} kg` });
  if (specs.suspension_mm) rows.push({ key: "suspension", label: "Curso de suspensão", value: `${specs.suspension_mm} mm` });
  if (specs.tank_l) rows.push({ key: "tank", label: "Tanque", value: `${specs.tank_l} L` });
  return rows;
}

export function getCategory(id: string): Category {
  return CATEGORY_BY_ID[id] ?? CATEGORY_BY_ID["production"];
}

export function dayOfIndex(seed: string, total: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return total > 0 ? h % total : 0;
}
