import { create } from 'zustand';

interface FocusTask {
  id: string;
  title: string;
}

interface FocusState {
  currentTask: FocusTask | null;
  isLockedMode: boolean;
  setCurrentTask: (task: FocusTask | null) => void;
  setLockedMode: (locked: boolean) => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  currentTask: null,
  isLockedMode: false,
  setCurrentTask: (task) => set({ currentTask: task }),
  setLockedMode: (locked) => set({ isLockedMode: locked }),
}));
