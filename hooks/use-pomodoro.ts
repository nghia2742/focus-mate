'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type PomodoroMode = 'focus' | 'short-break' | 'long-break';
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'finished';

interface UsePomodoroOptions {
    focusDuration?: number; // seconds
    shortBreakDuration?: number;
    longBreakDuration?: number;
    longBreakInterval?: number;
}

export function usePomodoro({
    focusDuration = 5,
    shortBreakDuration = 2,
    longBreakDuration = 15 * 60,
    longBreakInterval = 4,
}: UsePomodoroOptions = {}) {
    const [mode, setMode] = useState<PomodoroMode>('focus');
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
    };

    const pause = () => {
        setStatus('paused');
    };

    const reset = () => {
        setStatus('idle');
        setTimeLeft(getDuration(mode));
    };

    const switchMode = (newMode: PomodoroMode) => {
        setMode(newMode);
        setStatus('idle');
        setTimeLeft(getDuration(newMode));
    };

    // countdown logic
    useEffect(() => {
        if (status !== 'running') return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
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
