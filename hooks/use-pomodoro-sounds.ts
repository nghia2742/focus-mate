'use client';

import { useEffect, useRef } from 'react';
import { PomodoroStatus } from './use-pomodoro-types';
import { useSettings } from '@/store/use-settings';

/**
 * Hook to handle session completion sounds.
 */
export function usePomodoroSounds(status: PomodoroStatus) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { alarmSound } = useSettings();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const soundPath = `/sounds/alarm-sounds/${alarmSound}.mp3`;
        
        if (!audioRef.current || audioRef.current.src !== window.location.origin + soundPath) {
            audioRef.current = new Audio(soundPath);
        }

        if (status === 'finished') {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => {
                console.error("Audio playback failed:", err);
            });
        }
    }, [status, alarmSound]);
}
