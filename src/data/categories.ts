export type VehicleType = "carro" | "utv" | "moto" | "quadri" | "apoio";

export interface AttrRange { min: number; max: number; default: number }

export interface Category {
  id: string;
  name: string;
  short: string;
  type: VehicleType;
  level: number; // 0-100, peso da categoria na raridade
  description: string;
  ranges: {
    power_cv: AttrRange;
    torque_kgfm: AttrRange;
    weight_kg: AttrRange;
    suspension_mm: AttrRange;
    tank_l: AttrRange;
  };
}

const r = (min: number, max: number, def: number): AttrRange => ({ min, max, default: def });

export const CATEGORIES: Category[] = [
  { id: "ultimate_t1_plus", name: "Ultimate / T1+", short: "T1+", type: "carro", level: 100,
    description: "Protótipos topo de linha, tração integral e suspensão longa. Os carros mais rápidos e caros do grid.",
    ranges: { power_cv: r(280, 420, 360), torque_kgfm: r(50, 80, 65), weight_kg: r(1900, 2200, 2050), suspension_mm: r(300, 360, 350), tank_l: r(400, 560, 500) } },
  { id: "t1_1", name: "T1.1 (Rally padrão)", short: "T1.1", type: "carro", level: 80,
    description: "Protótipos de rally com regulamento um degrau abaixo do T1+.",
    ranges: { power_cv: r(220, 340, 280), torque_kgfm: r(40, 65, 52), weight_kg: r(1750, 2100, 1900), suspension_mm: r(250, 320, 280), tank_l: r(300, 500, 400) } },
  { id: "production", name: "Production", short: "PROD", type: "carro", level: 60,
    description: "Veículos mais próximos dos de série, com especiais mais curtas.",
    ranges: { power_cv: r(170, 300, 220), torque_kgfm: r(35, 60, 45), weight_kg: r(1800, 2300, 2000), suspension_mm: r(200, 280, 240), tank_l: r(150, 350, 250) } },
  { id: "classic", name: "Classic", short: "CLASSIC", type: "carro", level: 70,
    description: "Carros históricos que marcaram época no rally.",
    ranges: { power_cv: r(150, 320, 250), torque_kgfm: r(30, 60, 45), weight_kg: r(1700, 2200, 1950), suspension_mm: r(200, 300, 250), tank_l: r(150, 400, 280) } },
  { id: "utv_challenger_t3", name: "UTV Challenger (T3)", short: "T3", type: "utv", level: 75,
    description: "UTVs protótipo leves, categoria internacional Challenger.",
    ranges: { power_cv: r(150, 220, 190), torque_kgfm: r(15, 30, 22), weight_kg: r(850, 1000, 920), suspension_mm: r(450, 560, 500), tank_l: r(100, 160, 130) } },
  { id: "utv_ssv_t4", name: "UTV SSV (T4)", short: "T4", type: "utv", level: 70,
    description: "UTVs de produção modificados, a categoria mais numerosa do rally.",
    ranges: { power_cv: r(150, 240, 200), torque_kgfm: r(15, 30, 21), weight_kg: r(900, 1050, 960), suspension_mm: r(400, 520, 480), tank_l: r(90, 150, 120) } },
  { id: "utv_sportbay", name: "UTV Sportbay", short: "SPORTBAY", type: "utv", level: 65,
    description: "Disputa paralela com Can-Am Maverick R preparados pela Sportbay.",
    ranges: { power_cv: r(190, 260, 240), torque_kgfm: r(15, 30, 21), weight_kg: r(900, 1050, 960), suspension_mm: r(450, 560, 500), tank_l: r(90, 150, 120) } },
  { id: "moto", name: "Moto (Elite)", short: "MOTO", type: "moto", level: 85,
    description: "A categoria principal das motos. Piloto navega sozinho, sem copiloto.",
    ranges: { power_cv: r(50, 75, 60), torque_kgfm: r(4, 6, 5), weight_kg: r(135, 165, 145), suspension_mm: r(290, 330, 310), tank_l: r(25, 36, 30) } },
  { id: "rally2", name: "Rally 2", short: "RALLY2", type: "moto", level: 70,
    description: "Motos de rally de produção, segundo escalão internacional.",
    ranges: { power_cv: r(45, 70, 55), torque_kgfm: r(4, 6, 5), weight_kg: r(135, 170, 150), suspension_mm: r(280, 320, 300), tank_l: r(20, 34, 28) } },
  { id: "moto1", name: "Moto 1", short: "MOTO1", type: "moto", level: 60,
    description: "Motos até 450cc com menos preparação.",
    ranges: { power_cv: r(40, 62, 50), torque_kgfm: r(3.5, 5.5, 4.5), weight_kg: r(120, 160, 140), suspension_mm: r(280, 320, 300), tank_l: r(15, 30, 22) } },
  { id: "feminino", name: "Feminino", short: "FEM", type: "moto", level: 70,
    description: "Categoria das pilotas de moto.",
    ranges: { power_cv: r(40, 65, 52), torque_kgfm: r(3.5, 5.5, 4.5), weight_kg: r(120, 160, 140), suspension_mm: r(280, 320, 300), tank_l: r(15, 30, 22) } },
  { id: "self", name: "Self", short: "SELF", type: "moto", level: 78,
    description: "O piloto faz toda a manutenção sozinho, com kit de ferramentas da organização.",
    ranges: { power_cv: r(40, 65, 52), torque_kgfm: r(3.5, 5.5, 4.5), weight_kg: r(120, 160, 140), suspension_mm: r(280, 320, 300), tank_l: r(15, 30, 22) } },
  { id: "quadriciclo", name: "Quadriciclo", short: "QUADRI", type: "quadri", level: 65,
    description: "Quadriciclos de rally, pilotados solo.",
    ranges: { power_cv: r(40, 65, 50), torque_kgfm: r(4, 6, 5), weight_kg: r(180, 260, 220), suspension_mm: r(230, 300, 260), tank_l: r(20, 40, 30) } },
  { id: "apoio", name: "Carro de apoio / Assistência", short: "APOIO", type: "apoio", level: 30,
    description: "Caminhões e picapes de assistência que seguem a equipe por deslocamento.",
    ranges: { power_cv: r(150, 600, 300), torque_kgfm: r(30, 250, 100), weight_kg: r(2000, 16000, 6000), suspension_mm: r(150, 300, 220), tank_l: r(80, 800, 300) } },
];

export const CATEGORY_BY_ID: Record<string, Category> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export const TYPE_LABEL: Record<VehicleType, string> = {
  carro: "Carro", utv: "UTV", moto: "Moto", quadri: "Quadriciclo", apoio: "Apoio",
};

export const TYPE_ORDER: VehicleType[] = ["carro", "utv", "moto", "quadri", "apoio"];
