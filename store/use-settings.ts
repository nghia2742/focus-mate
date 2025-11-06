import { create } from 'zustand';
import { TIMER } from '@/hooks/use-pomodoro';

export type SettingsState = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  autoStartNext: boolean;
  setFocusMinutes: (m: number) => void;
  setShortBreakMinutes: (m: number) => void;
  setLongBreakMinutes: (m: number) => void;
  setAutoStartNext: (v: boolean) => void;
};

export const useSettings = create<SettingsState>((set) => ({
  focusMinutes: Math.round(TIMER.FOCUS / 60),
  shortBreakMinutes: Math.round(TIMER.SHORT_BREAK / 60),
  longBreakMinutes: Math.round(TIMER.LONG_BREAK / 60),
  autoStartNext: false,
  setFocusMinutes: (m) => set({ focusMinutes: Math.max(1, Math.min(120, Math.round(m))) }),
  setShortBreakMinutes: (m) => set({ shortBreakMinutes: Math.max(1, Math.min(60, Math.round(m))) }),
  setLongBreakMinutes: (m) => set({ longBreakMinutes: Math.max(1, Math.min(120, Math.round(m))) }),
  setAutoStartNext: (v) => set({ autoStartNext: v }),
}));