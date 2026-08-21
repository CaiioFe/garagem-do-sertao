export interface Partner {
  id: string; name: string; kind: "expedicao" | "patrocinador"; featured?: boolean;
  tagline: string; description?: string; site?: string; instagram?: string; whatsapp?: string; city?: string; dates?: string;
}

export const PARTNERS: Partner[] = [
  { id: "planeta4x4", name: "Planeta 4x4 Expedições", kind: "expedicao", featured: true, city: "Florianópolis (SC)",
    tagline: "Siga o rally de dentro: expedição 4x4 de 22 a 30/08, 15 veículos, guias com 10 anos de estrada.",
    description: "Operador homologado do programa Expedições Sertões. Apoio logístico com GPS, rádio, guincho, acesso à Vila Sertões, arquibancada do Super Prime, rampas de largada e chegada e medalha oficial.",
    site: "https://planeta4x4expedicoes.com.br/expedicao-sertoes/", instagram: "planeta4x4expedicoes", dates: "22 a 30/08/2026" },
  { id: "gaia", name: "Gaia Expedições", kind: "expedicao", featured: true, city: "São Paulo (SP)",
    tagline: "Expedição Sertões Gaia 2026, com opção Fly & Drive: você voa e pega o 4x4 no destino.",
    description: "Comboio segue o roteiro do rally, assiste às especiais em pontos VIP, visita atrativos e se hospeda em hotéis selecionados.",
    site: "https://www.gaiaexpedicoes.com/", dates: "22 a 29/08/2026" },
  { id: "4x4pordiversao", name: "4x4 por Diversão", kind: "expedicao", tagline: "Operador homologado Expedições Sertões." },
  { id: "advmototrips", name: "ADV Moto Trips", kind: "expedicao", tagline: "Expedição de moto acompanhando o rally." },
  { id: "hondaredrider", name: "Honda Red Rider Off Road School", kind: "expedicao", tagline: "Operador homologado Expedições Sertões." },
  { id: "keeptrack", name: "KeepTrack 4x4", kind: "expedicao", tagline: "Operador homologado Expedições Sertões.", site: "https://www.keeptrack.com.br/" },
  { id: "serialtrippers", name: "Serial Trippers", kind: "expedicao", tagline: "Operador homologado Expedições Sertões." },
  { id: "tsp4x4", name: "TSP 4x4", kind: "expedicao", tagline: "Operador homologado Expedições Sertões." },
  { id: "via4x4", name: "Via 4x4", kind: "expedicao", tagline: "Operador homologado Expedições Sertões." },
];

export const EXPEDITIONS_OFFICIAL_URL = "https://rally.sertoes.com.br/sertoes-expedition/";
