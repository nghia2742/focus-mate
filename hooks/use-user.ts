import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function useUser() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    // Tránh fetch lại liên tục vì auth state được quản lý qua listener bên dưới
    staleTime: Infinity,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      // Cập nhật cache của TanStack Query ngay khi auth state thay đổi
      queryClient.setQueryData(["auth-user"], newUser);
    });

    return () => subscription.unsubscribe();
  }, [supabase, queryClient]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
