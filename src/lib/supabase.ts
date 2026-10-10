import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!url || !key) {
  console.warn("Supabase: faltam VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
}

// O banco mora no hub-central, no schema proprio "garagem" (desde 10/10/2026).
export const supabase = createClient(url ?? "", key ?? "", {
  db: { schema: "garagem" },
  auth: { persistSession: false, autoRefreshToken: false },
});

export const SUPABASE_URL = url;
