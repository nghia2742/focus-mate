import { create } from 'zustand';
import type { StateCreator } from 'zustand';

export type SoundscapeType = 'rain' | 'fire' | 'windy' | null;

export type SoundState = {
    sound: SoundscapeType;
    inputUrl?: string;
    isYoutubeReady?: boolean;
    isYoutubePlaying?: boolean;
    setSound: (s: SoundscapeType) => void;
    handleApply: (url: string) => void;
    handleClose: () => void;
    handlePlay: (on?: boolean) => void;
};

const initializer: StateCreator<SoundState> = (set) => ({
    sound: 'rain',
    setSound: (s: SoundscapeType) => set({ sound: s }),
    handleApply: (url: string) => set({ inputUrl: url, isYoutubeReady: true, isYoutubePlaying: false }),
    handleClose: () => set({ inputUrl: '', isYoutubeReady: false, isYoutubePlaying: false }),
    handlePlay: (on?: boolean) => set((state) => ({ isYoutubePlaying: on ?? !state.isYoutubePlaying })),
});

export const useSound = create<SoundState>(initializer);

export default useSound;
