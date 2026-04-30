"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./use-user";

export function useDailyStats() {
  const { user } = useUser();
  const supabase = createClient();

  return useQuery({
    queryKey: ["daily-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("user_daily_stats")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
