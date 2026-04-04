'use client';

import { useEffect, useRef } from 'react';
import { PomodoroStatus } from './use-pomodoro-types';

/**
 * Hook to handle session completion sounds.
 */
export function usePomodoroSounds(status: PomodoroStatus) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        if (!audioRef.current) {
            audioRef.current = new Audio('/sounds/bell.mp3');
        }

        if (status === 'finished') {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => {
                console.error("Audio playback failed:", err);
            });
        }
    }, [status]);
}
