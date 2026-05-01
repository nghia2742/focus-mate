import { TIMER } from '@/shared/constant';
import { create } from 'zustand';

export type SettingsState = {
    focusMinutes: number;
    shortBreakMinutes: number;
    longBreakMinutes: number;
    longBreakInterval: number;
    autoStartNext: boolean;
    notificationsEnabled: boolean;
    alarmSound: string;
    setFocusMinutes: (m: number) => void;
    setShortBreakMinutes: (m: number) => void;
    setLongBreakMinutes: (m: number) => void;
    setLongBreakInterval: (v: number) => void;
    setAutoStartNext: (v: boolean) => void;
    setNotificationsEnabled: (v: boolean) => void;
    setAlarmSound: (v: string) => void;
};

export const useSettings = create<SettingsState>((set) => ({
    focusMinutes: Math.round(TIMER.FOCUS / 60),
    shortBreakMinutes: Math.round(TIMER.SHORT_BREAK / 60),
    longBreakMinutes: Math.round(TIMER.LONG_BREAK / 60),
    longBreakInterval: TIMER.LONG_BREAK_CYCLE,
    autoStartNext: false,
    notificationsEnabled: false,
    alarmSound: 'bell',
    setFocusMinutes: (m) =>
        set({ focusMinutes: Math.max(1, Math.min(120, Math.round(m))) }),
    setShortBreakMinutes: (m) =>
        set({ shortBreakMinutes: Math.max(1, Math.min(60, Math.round(m))) }),
    setLongBreakMinutes: (m) =>
        set({ longBreakMinutes: Math.max(1, Math.min(120, Math.round(m))) }),
    setLongBreakInterval: (v) =>
        set({ longBreakInterval: Math.max(1, Math.min(10, Math.round(v))) }),
    setAutoStartNext: (v) => set({ autoStartNext: v }),
    setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
    setAlarmSound: (v) => set({ alarmSound: v }),
}));
