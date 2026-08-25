import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Vehicle } from "@/lib/types";

const SELECT = "*, teams:team_id(id,slug,name,city,state,logo_url,verified)";

export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async (): Promise<Vehicle[]> => {
      const { data, error } = await supabase.from("vehicles").select(SELECT).order("card_number");
      if (error) throw error;
      return data as unknown as Vehicle[];
    },
    staleTime: 30_000,
  });
}

export function useVehicle(slug: string | undefined) {
  return useQuery({
    queryKey: ["vehicle", slug],
    queryFn: async (): Promise<Vehicle | null> => {
      if (!slug) return null;
      const { data, error } = await supabase.from("vehicles").select(SELECT).eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data as unknown as Vehicle | null;
    },
    enabled: !!slug,
  });
}

export function useTeamVehicles(teamId: string | undefined) {
  return useQuery({
    queryKey: ["vehicles", "team", teamId],
    queryFn: async (): Promise<Vehicle[]> => {
      if (!teamId) return [];
      const { data, error } = await supabase.from("vehicles").select(SELECT).eq("team_id", teamId).order("card_number");
      if (error) throw error;
      return data as unknown as Vehicle[];
    },
    enabled: !!teamId,
  });
}
