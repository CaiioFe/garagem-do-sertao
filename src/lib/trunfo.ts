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

export type Tier = "comum" | "rara" | "epica" | "lendaria" | "mitica";

export const TIER_LABEL: Record<Tier, string> = {
  comum: "Comum",
  rara: "Rara",
  epica: "Épica",
  lendaria: "Lendária",
  mitica: "Mítica",
};

function pct(value: number | undefined, range: { min: number; max: number; default: number }): number {
  const v = value ?? range.default;
  const clamped = Math.min(range.max, Math.max(range.min, v));
  const raw = ((clamped - range.min) / (range.max - range.min)) * 100;
  return Math.round(Math.min(100, Math.max(5, raw)));
}

export interface AttrRow {
  key: string;
  label: string;
  score: number; // 0-100
  raw?: string;
}

export function computeAttributes(specs: VehicleSpecs, history: VehicleHistory, category: Category): AttrRow[] {
  const r = category.ranges;

  const powerToWeight = (cv?: number, kg?: number) => {
    const c = cv ?? r.power_cv.default;
    const w = kg ?? r.weight_kg.default;
    return w > 0 ? (c / w) * 1000 : 0; // cv por tonelada
  };
  const agility = powerToWeight(specs.power_cv, specs.weight_kg);
  const agilityRange = { min: 60, max: 260, default: powerToWeight(r.power_cv.default, r.weight_kg.default) };

  const resistanceRaw =
    pct(specs.suspension_mm, r.suspension_mm) * 0.6 + pct(specs.tank_l, r.tank_l) * 0.4;

  const lenda = Math.min(100, (history.sertoes_count ?? 0) * 6);
  const titulos = Math.min(
    100,
    (history.titles_general ?? 0) * 40 + (history.titles_category ?? 0) * 20 + (history.stage_wins ?? 0) * 5 + (history.podiums ?? 0) * 3,
  );

  return [
    { key: "power", label: "Potência", score: pct(specs.power_cv, r.power_cv), raw: specs.power_cv ? `${specs.power_cv} cv` : "estimado" },
    { key: "torque", label: "Força bruta", score: pct(specs.torque_kgfm, r.torque_kgfm), raw: specs.torque_kgfm ? `${specs.torque_kgfm} kgfm` : "estimado" },
    { key: "agility", label: "Agilidade", score: Math.round(pct(agility, agilityRange)), raw: specs.power_cv && specs.weight_kg ? `${agility.toFixed(0)} cv/t` : "estimado" },
    { key: "resistance", label: "Resistência", score: Math.round(resistanceRaw), raw: specs.suspension_mm ? `${specs.suspension_mm} mm` : "estimado" },
    { key: "legend", label: "Lenda", score: lenda, raw: history.sertoes_count ? `${history.sertoes_count}x Sertões` : "estreante" },
    { key: "titles", label: "Títulos", score: titulos, raw: (history.titles_general || history.titles_category) ? "premiado" : "sem títulos" },
  ];
}

export function computeRarity(
  history: VehicleHistory,
  category: Category,
  completeness: number, // 0-100
  exclusivity = 50,
): { score: number; tier: Tier } {
  const titulos = Math.min(100, (history.titles_general ?? 0) * 40 + (history.titles_category ?? 0) * 20 + (history.stage_wins ?? 0) * 5 + (history.podiums ?? 0) * 3);
  const lenda = Math.min(100, (history.sertoes_count ?? 0) * 6);
  const score = Math.round(
    titulos * 0.35 + lenda * 0.25 + category.level * 0.2 + exclusivity * 0.1 + completeness * 0.1,
  );
  let tier: Tier = "comum";
  if (score >= 95) tier = "mitica";
  else if (score >= 80) tier = "lendaria";
  else if (score >= 60) tier = "epica";
  else if (score >= 40) tier = "rara";
  return { score, tier };
}

export function computeCompleteness(v: {
  photo_url?: string | null;
  pilot_name?: string | null;
  navigator_name?: string | null;
  description?: string | null;
  specs?: VehicleSpecs;
}): number {
  let filled = 0;
  const total = 6;
  if (v.photo_url) filled++;
  if (v.pilot_name) filled++;
  if (v.navigator_name) filled++;
  if (v.description) filled++;
  if (v.specs?.power_cv) filled++;
  if (v.specs?.weight_kg) filled++;
  return Math.round((filled / total) * 100);
}

export function getCategory(id: string): Category {
  return CATEGORY_BY_ID[id] ?? CATEGORY_BY_ID["production"];
}

export function dayOfIndex(seed: string, total: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return total > 0 ? h % total : 0;
}
