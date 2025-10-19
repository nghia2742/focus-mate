import { create } from 'zustand';
import type { StateCreator } from 'zustand';

export type SoundscapeType = 'rain' | 'fire' | 'windy' | null;

export type SoundState = {
    sound: SoundscapeType;
    inputUrl?: string;
    isYoutubeReady?: boolean;
    isPlaying?: boolean;
    type: 'soundscape' | 'youtube';
    setSound: (s: SoundscapeType) => void;
    handleApply: (url: string) => void;
    handleClose: () => void;
    handlePlay: (on?: boolean) => void;
};

const initializer: StateCreator<SoundState> = (set) => ({
    sound: null,
    type: 'soundscape',
    setSound: (s: SoundscapeType) => set({ sound: s }),
    handleApply: (url: string) =>
        set({
            inputUrl: url,
            sound: null,
            isYoutubeReady: true,
            type: 'youtube',
            isPlaying: false,
        }),
    handleClose: () =>
        set({
            inputUrl: '',
            isYoutubeReady: false,
            type: 'soundscape',
            isPlaying: false,
        }),
    handlePlay: (on?: boolean) =>
        set((state) => ({ isPlaying: on ?? !state.isPlaying })),
});

export const useSound = create<SoundState>(initializer);

export default useSound;
