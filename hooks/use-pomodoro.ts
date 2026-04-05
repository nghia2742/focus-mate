'use client';

import { TIMER } from '@/shared/constant';
import { useSettings } from '@/store/use-settings';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePomodoroSounds } from './use-pomodoro-sounds';
import { usePomodoroTitle } from './use-pomodoro-title';
import { PomodoroMode, PomodoroStatus, UsePomodoroOptions } from './use-pomodoro-types';

// Re-export types to maintain backward compatibility
export type { PomodoroMode, PomodoroStatus, UsePomodoroOptions };

export function usePomodoro({
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval: longBreakIntervalOption,
}: UsePomodoroOptions = {}) {
    const settings = useSettings();
    const longBreakInterval = longBreakIntervalOption ?? settings.longBreakInterval;

    const focusSec = focusDuration ?? settings.focusMinutes * 60;
    const shortSec = shortBreakDuration ?? settings.shortBreakMinutes * 60;
    const longSec = longBreakDuration ?? settings.longBreakMinutes * 60;

    const [mode, setMode] = useState<PomodoroMode>('focus');
    const [status, setStatus] = useState<PomodoroStatus>('idle');
    const [timeLeft, setTimeLeft] = useState(focusSec);
    const [cycleCount, setCycleCount] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Sub-hooks for side effects
    usePomodoroTitle(status, timeLeft, mode);
    usePomodoroSounds(status);

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
    };

    const pause = () => {
        setStatus('paused');
    };

    const reset = () => {
        setTimeLeft(getDuration(mode));
    };

    const stop = () => {
        setStatus('idle');
        setMode('focus');
        setCycleCount(0);
        setTimeLeft(getDuration('focus'));
    };

    const skip = () => {
        if (mode === 'focus') {
            const nextCycle = cycleCount + 1;
            const nextMode =
                nextCycle % longBreakInterval === 0
                    ? 'long-break'
                    : 'short-break';
            switchMode(nextMode, false);
        } else {
            setCycleCount((c) => c + 1);
            switchMode('focus', false);
        }
    };

    const switchMode = (newMode: PomodoroMode, autostart?: boolean) => {
        setMode(newMode);
        setStatus(autostart ? 'running' : 'idle');
        setTimeLeft(getDuration(newMode));
    };

    // react to settings updates by resetting timeLeft if idle
    useEffect(() => {
        if (status === 'idle') {
            setTimeLeft(getDuration(mode));
        }
    }, [focusSec, shortSec, longSec, mode, status, getDuration]);

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

    // Cleanup and auto-transition logic when finished
    useEffect(() => {
        if (status !== 'finished') return;

        // Transitions
        if (mode === 'focus') {
            const nextCycle = cycleCount + 1;
            const nextMode =
                nextCycle % longBreakInterval === 0
                    ? 'long-break'
                    : 'short-break';
            switchMode(nextMode, settings.autoStartNext);
        } else {
            setCycleCount((c) => c + 1);
            switchMode('focus', settings.autoStartNext);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, mode, cycleCount, longBreakInterval, settings.autoStartNext]);

    return {
        mode,
        status,
        timeLeft,
        cycleCount,
        start,
        pause,
        reset,
        stop,
        skip,
        switchMode,
    };
}
