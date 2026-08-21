import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Team } from "@/lib/types";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async (): Promise<Team[]> => {
      const { data, error } = await supabase.from("teams").select("*").order("featured", { ascending: false }).order("name");
      if (error) throw error;
      return data as Team[];
    },
    staleTime: 60_000,
  });
}

export function useTeam(slug: string | undefined) {
  return useQuery({
    queryKey: ["team", slug],
    queryFn: async (): Promise<Team | null> => {
      if (!slug) return null;
      const { data, error } = await supabase.from("teams").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data as Team | null;
    },
    enabled: !!slug,
  });
}
