import useSound from '@/store/use-sound';
import { useEffect, useRef, useState } from 'react';

export type SoundscapeType = 'rain' | 'fire' | 'windy' | null;

const soundMap: Record<Exclude<SoundscapeType, null>, string> = {
    rain: '/sounds/rain/rain_1.mp3',
    fire: '/sounds/fire/fire_1.mp3',
    windy: '/sounds/windy/windy_1.mp3',
};

export function useSoundscape() {
    const { sound } = useSound();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!sound) return;
        const audio = new Audio(soundMap[sound]);
        audio.loop = true;
        audio.volume = 1;
        audioRef.current = audio;
        if (!audio) return;
    }, [sound]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.play();
            else audioRef.current.pause();
        }
    }, [isPlaying]);

    return {
        sound,
        isPlaying,
        togglePlay: (force?: boolean) => setIsPlaying((prev) => force ?? !prev),
        stop: () => {
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        },
    };
}
