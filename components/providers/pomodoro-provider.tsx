"use client";

import { useEffect, useRef } from "react";
import { usePomodoroStore } from "@/store/use-pomodoro-store";
import { useSettings } from "@/store/use-settings";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const store = usePomodoroStore();
  const settings = useSettings();
  const { user } = useUser();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync settings to store
  useEffect(() => {
    store.updateSettings({
      focusMinutes: settings.focusMinutes,
      shortBreakMinutes: settings.shortBreakMinutes,
      longBreakMinutes: settings.longBreakMinutes,
      longBreakInterval: settings.longBreakInterval,
      autoStartNext: settings.autoStartNext,
    });
  }, [
    settings.focusMinutes,
    settings.shortBreakMinutes,
    settings.longBreakMinutes,
    settings.longBreakInterval,
    settings.autoStartNext,
    store.updateSettings
  ]);

  // Reset timeLeft when settings change if idle
  useEffect(() => {
    if (store.status === 'idle') {
      const duration = store.mode === 'focus' 
        ? settings.focusMinutes 
        : store.mode === 'short-break' 
          ? settings.shortBreakMinutes 
          : settings.longBreakMinutes;
      store.setTimeLeft(duration * 60);
    }
  }, [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes, store.mode, store.status]);

  // Save Session Mutation
  const saveSessionMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const duration = store.focusMinutes;
      const today = new Date().toISOString().split('T')[0];
      const activeTodoId = store.activeTodoId;

      // 1. Record session
      const { error: sessionError } = await supabase
        .from('focus_sessions')
        .insert({
          user_id: user.id,
          todo_id: activeTodoId,
          duration_minutes: duration
        });
      if (sessionError) throw sessionError;

      // 2. Update Daily Stats
      const { data: dailyStats, error: fetchDailyError } = await supabase
        .from('user_daily_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();
      
      if (fetchDailyError) throw fetchDailyError;

      if (dailyStats) {
        await supabase
          .from('user_daily_stats')
          .update({ total_minutes: (dailyStats.total_minutes ?? 0) + duration })
          .eq('user_id', user.id)
          .eq('date', today);
      } else {
        await supabase
          .from('user_daily_stats')
          .insert({ user_id: user.id, date: today, total_minutes: duration });
      }

      // 3. Update Profile & Streak
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;

      if (profile) {
        let newStreak = profile.current_streak || 0;
        const lastDate = profile.last_focus_date;
        
        if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastDate === yesterdayStr) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }

        await supabase
          .from('profiles')
          .update({
            current_streak: newStreak,
            last_focus_date: today,
            total_focus_minutes: (profile.total_focus_minutes || 0) + duration,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } else {
        // Create profile if not exists
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            current_streak: 1,
            last_focus_date: today,
            total_focus_minutes: duration
          });
      }

      // 4. Update Todo if assigned
      if (activeTodoId) {
        const { data: todo } = await supabase
          .from('todos')
          .select('total_minutes_spent')
          .eq('id', activeTodoId)
          .maybeSingle();
        
        if (todo) {
          await supabase
            .from('todos')
            .update({ total_minutes_spent: (todo.total_minutes_spent || 0) + duration })
            .eq('id', activeTodoId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["daily-stats"] });
      queryClient.invalidateQueries({ queryKey: ["daily-stats"] });
    },
    onError: (err) => {
      console.error("Failed to save session:", err);
      toast.error("Progress couldn't be saved.");
    }
  });

  // Timer loop
  useEffect(() => {
    if (store.status === 'running') {
      timerRef.current = setInterval(() => {
        store.tick();
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [store.status, store.tick]);

  // Handle finished status
  useEffect(() => {
    if (store.status === 'finished') {
      if (store.mode === 'focus') {
        saveSessionMutation.mutate();
      }

      // Transitions
      const nextCycle = store.mode === 'focus' ? store.cycleCount + 1 : store.cycleCount;
      if (store.mode === 'focus') {
        const isLongBreak = nextCycle % store.longBreakInterval === 0;
        store.setMode(isLongBreak ? 'long-break' : 'short-break');
        store.setTimeLeft((isLongBreak ? store.longBreakMinutes : store.shortBreakMinutes) * 60);
      } else {
        store.setCycleCount(nextCycle);
        store.setMode('focus');
        store.setTimeLeft(store.focusMinutes * 60);
      }

      store.setStatus(store.autoStartNext ? 'running' : 'idle');
    }
  }, [store.status]);

  return <>{children}</>;
}
