'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import useSound from '@/store/use-sound';
import { useSettings } from '@/store/use-settings';

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
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval = TIMER.LONG_BREAK_CYCLE,
}: UsePomodoroOptions = {}) {
    const { handlePlay } = useSound();
    const settings = useSettings();

    const focusSec = (focusDuration ?? settings.focusMinutes * 60);
    const shortSec = (shortBreakDuration ?? settings.shortBreakMinutes * 60);
    const longSec = (longBreakDuration ?? settings.longBreakMinutes * 60);

    const [mode, setMode] = useState<PomodoroMode>('focus');
    const [status, setStatus] = useState<PomodoroStatus>('idle');
    const [timeLeft, setTimeLeft] = useState(focusSec);
    const [cycleCount, setCycleCount] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const getDuration = useCallback(
        (newMode: PomodoroMode) => {
            switch (newMode) {
                case 'focus':
                    return focusSec;
                case 'short-break':
                    return shortSec;
                case 'long-break':
                    return longSec;
                default:
                    return focusSec;
            }
        },
        [focusSec, shortSec, longSec]
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

    const switchMode = (newMode: PomodoroMode, autostart?: boolean) => {
        setMode(newMode);
        setStatus(autostart ? 'running' : 'idle');
        setTimeLeft(getDuration(newMode));
        if (newMode === 'focus') handlePlay(autostart ? true : false);
        else handlePlay(false);
    };

    // react to settings updates by resetting timeLeft if idle/paused
    useEffect(() => {
        if (status !== 'running') {
            setTimeLeft(getDuration(mode));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusSec, shortSec, longSec, mode]);

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

        // play bell
        const audio = new Audio('/sounds/bell.mp3');
        audio.play();

        if (mode === 'focus') {
            const nextCycle = cycleCount + 1;
            setCycleCount(nextCycle);
            const nextMode = nextCycle % longBreakInterval === 0 ? 'long-break' : 'short-break';
            switchMode(nextMode, settings.autoStartNext);
        } else {
            switchMode('focus', settings.autoStartNext);
        }
    }, [status, mode, cycleCount, longBreakInterval, settings.autoStartNext]);

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
