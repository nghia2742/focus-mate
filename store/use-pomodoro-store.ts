import { create } from 'zustand';
import { PomodoroMode, PomodoroStatus } from '@/hooks/use-pomodoro-types';

interface PomodoroState {
  mode: PomodoroMode;
  status: PomodoroStatus;
  timeLeft: number;
  cycleCount: number;
  activeTodoId: string | null;
  activeTodoTitle: string | null;
  
  // Settings sync
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  autoStartNext: boolean;

  // Actions
  setMode: (mode: PomodoroMode) => void;
  setStatus: (status: PomodoroStatus) => void;
  setTimeLeft: (time: number | ((prev: number) => number)) => void;
  setCycleCount: (count: number | ((prev: number) => number)) => void;
  setActiveTodo: (id: string | null, title: string | null) => void;
  
  updateSettings: (settings: {
    focusMinutes: number;
    shortBreakMinutes: number;
    longBreakMinutes: number;
    longBreakInterval: number;
    autoStartNext: boolean;
  }) => void;

  tick: () => void;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  mode: 'focus',
  status: 'idle',
  timeLeft: 25 * 60,
  cycleCount: 0,
  activeTodoId: null,
  activeTodoTitle: null,
  
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartNext: false,

  setMode: (mode) => set({ mode }),
  setStatus: (status) => set({ status }),
  setTimeLeft: (time) => set((state) => ({ 
    timeLeft: typeof time === 'function' ? time(state.timeLeft) : time 
  })),
  setCycleCount: (count) => set((state) => ({ 
    cycleCount: typeof count === 'function' ? count(state.cycleCount) : count 
  })),
  setActiveTodo: (id, title) => set({ activeTodoId: id, activeTodoTitle: title }),
  
  updateSettings: (settings) => set({ ...settings }),

  tick: () => {
    const { status, timeLeft } = get();
    if (status !== 'running') return;

    if (timeLeft <= 0) {
      set({ status: 'finished' });
    } else {
      set({ timeLeft: timeLeft - 1 });
    }
  },
}));
