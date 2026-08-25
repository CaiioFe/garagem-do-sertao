import type { VehicleSpecs, VehicleHistory, VehicleResult } from "./trunfo";

export interface Team {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  cover_url: string | null;
  description: string | null;
  instagram: string | null;
  whatsapp: string | null;
  website: string | null;
  sponsors: string[];
  founded_year: number | null;
  sertoes_participations: number;
  titles_general: number;
  titles_category: number;
  featured: boolean;
  status: "active" | "hidden";
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  team_id: string;
  slug: string;
  card_number: number;
  name: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  race_number: string | null;
  category_id: string;
  type: "carro" | "utv" | "moto" | "quadri" | "apoio";
  photo_url: string | null;
  pilot_name: string | null;
  pilot_photo_url: string | null;
  pilot_city: string | null;
  navigator_name: string | null;
  navigator_photo_url: string | null;
  specs: VehicleSpecs;
  history: VehicleHistory;
  result: VehicleResult | null;
  description: string | null;
  sponsors: string[];
  likes_count: number;
  featured: boolean;
  status: "active" | "hidden";
  created_at: string;
  updated_at: string;
  teams?: Pick<Team, "id" | "slug" | "name" | "city" | "state" | "logo_url" | "verified">;
}
