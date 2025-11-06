import { create } from 'zustand';
import type { StateCreator } from 'zustand';

export type SoundState = {
  inputUrl?: string;
  isYoutubeReady?: boolean;
  isPlaying?: boolean;
  handleApply: (url: string) => void;
  handleClose: () => void;
  handlePlay: (on?: boolean) => void;
};

const initializer: StateCreator<SoundState> = (set) => ({
  inputUrl: '',
  isYoutubeReady: false,
  isPlaying: false,
  handleApply: (url: string) =>
    set({
      inputUrl: url,
      isYoutubeReady: true,
      isPlaying: false,
    }),
  handleClose: () =>
    set({
      inputUrl: '',
      isYoutubeReady: false,
      isPlaying: false,
    }),
  handlePlay: (on?: boolean) =>
    set((state) => ({ isPlaying: on ?? !state.isPlaying })),
});

export const useSound = create<SoundState>(initializer);

export default useSound;
