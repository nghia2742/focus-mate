'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSoundscape } from './use-soundscape';
import useSound from '@/store/use-sound';

export type PomodoroMode = 'focus' | 'short-break' | 'long-break';
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'finished';

interface UsePomodoroOptions {
    focusDuration?: number; // seconds
    shortBreakDuration?: number;
    longBreakDuration?: number;
    longBreakInterval?: number;
}

export const TIMER = {
    FOCUS: 25 * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60,
    LONG_BREAK_CYCLE: 4,
};

export function usePomodoro({
    focusDuration = TIMER.FOCUS,
    shortBreakDuration = TIMER.SHORT_BREAK,
    longBreakDuration = TIMER.LONG_BREAK,
    longBreakInterval = TIMER.LONG_BREAK_CYCLE,
}: UsePomodoroOptions = {}) {
    const [mode, setMode] = useState<PomodoroMode>('focus');
    const { handlePlay } = useSound();

    const [status, setStatus] = useState<PomodoroStatus>('idle');
    const [timeLeft, setTimeLeft] = useState(focusDuration);
    const [cycleCount, setCycleCount] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const getDuration = useCallback(
        (newMode: PomodoroMode) => {
            switch (newMode) {
                case 'focus':
                    return focusDuration;
                case 'short-break':
                    return shortBreakDuration;
                case 'long-break':
                    return longBreakDuration;
                default:
                    return focusDuration;
            }
        },
        [focusDuration, shortBreakDuration, longBreakDuration]
    );

    const start = () => {
        if (status === 'running') return;
        setStatus('running');
        if (mode === 'focus') handlePlay(true);
    };

    const pause = () => {
        setStatus('paused');
        if (mode === 'focus') handlePlay(false);
    };

    const reset = () => {
        setStatus('idle');
        setTimeLeft(getDuration(mode));
        if (mode === 'focus') handlePlay(false);
    };

    const switchMode = (newMode: PomodoroMode) => {
        setMode(newMode);
        setStatus('idle');
        setTimeLeft(getDuration(newMode));
        if (mode === 'focus') handlePlay(false);
    };

    // countdown logic
    useEffect(() => {
        if (status !== 'running') return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 0) {
                    clearInterval(timerRef.current!);
                    setStatus('finished');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
    }, [status]);

    // when finished
    useEffect(() => {
        if (status !== 'finished') return;

        // play sound
        const audio = new Audio('/sounds/bell.mp3');
        audio.play();

        if (mode === 'focus') {
            const nextCycle = cycleCount + 1;
            setCycleCount(nextCycle);
            if (nextCycle % longBreakInterval === 0) {
                switchMode('long-break');
            } else {
                switchMode('short-break');
            }
        } else {
            switchMode('focus');
        }
    }, [status]);

    return {
        mode,
        status,
        timeLeft,
        cycleCount,
        start,
        pause,
        reset,
        switchMode,
    };
}
