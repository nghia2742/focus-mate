import { create } from 'zustand';

export type AmbientKey = "none" | "rain" | "fire" | "windy" | "waves" | "forest" | "cafe";

interface AmbientSound {
    id: AmbientKey;
    src: string;
}

const SOUNDS: Record<AmbientKey, string> = {
    none: "",
    rain: "/sounds/background-sounds/rain/rain_1.mp3",
    fire: "/sounds/background-sounds/fire/fire_1.mp3",
    windy: "/sounds/background-sounds/windy/windy_1.mp3",
    waves: "/sounds/background-sounds/waves/waves.mp3",
    forest: "/sounds/background-sounds/forest/forest.mp3",
    cafe: "/sounds/background-sounds/cafe/cafe.mp3",
};

interface AmbientState {
    activeSound: AmbientKey;
    volume: number;
    audio: HTMLAudioElement | null;
    setActiveSound: (sound: AmbientKey) => void;
    setVolume: (volume: number) => void;
    toggleSound: (sound: AmbientKey) => void;
}

export const useAmbient = create<AmbientState>((set, get) => ({
    activeSound: "none",
    volume: 50,
    audio: null,
    
    setActiveSound: (sound: AmbientKey) => {
        const { audio, volume } = get();
        
        // Stop current audio if any
        if (audio) {
            audio.pause();
            audio.src = "";
        }

        if (sound === "none") {
            set({ activeSound: "none", audio: null });
            return;
        }

        const newAudio = new Audio(SOUNDS[sound]);
        newAudio.loop = true;
        newAudio.volume = volume / 100;
        newAudio.play().catch(err => console.error("Audio play failed:", err));
        
        set({ activeSound: sound, audio: newAudio });
    },

    setVolume: (v: number) => {
        const { audio } = get();
        if (audio) {
            audio.volume = v / 100;
        }
        set({ volume: v });
    },

    toggleSound: (sound: AmbientKey) => {
        const { activeSound, setActiveSound } = get();
        if (activeSound === sound) {
            setActiveSound("none");
        } else {
            setActiveSound(sound);
        }
    }
}));
