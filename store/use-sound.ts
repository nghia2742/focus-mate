import { create } from 'zustand';
import type { StateCreator } from 'zustand';

export type SoundscapeType = 'rain' | 'fire' | 'windy' | null;

export type SoundState = {
    sound: SoundscapeType;
    setSound: (s: SoundscapeType) => void;
};

const initializer: StateCreator<SoundState> = (set) => ({
    sound: 'rain',
    setSound: (s: SoundscapeType) => set({ sound: s }),
});

export const useSound = create<SoundState>(initializer);

export default useSound;
