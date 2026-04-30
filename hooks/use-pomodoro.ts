'use client';

import { usePomodoroStore } from '@/store/use-pomodoro-store';
import { useCallback } from 'react';
import { usePomodoroTitle } from './use-pomodoro-title';
import { usePomodoroSounds } from './use-pomodoro-sounds';
import { PomodoroMode, PomodoroStatus } from './use-pomodoro-types';

export function usePomodoro() {
    const store = usePomodoroStore();

    // Side effects for title and sounds
    usePomodoroTitle(store.status, store.timeLeft, store.mode);
    usePomodoroSounds(store.status);

    const getDuration = useCallback(
        (newMode: PomodoroMode) => {
            switch (newMode) {
                case 'focus':
                    return store.focusMinutes * 60;
                case 'short-break':
                    return store.shortBreakMinutes * 60;
                case 'long-break':
                    return store.longBreakMinutes * 60;
                default:
                    return store.focusMinutes * 60;
            }
        },
        [store.focusMinutes, store.shortBreakMinutes, store.longBreakMinutes]
    );

    const start = () => {
        if (store.status === 'running') return;
        store.setStatus('running');
    };

    const pause = () => {
        store.setStatus('paused');
    };

    const reset = () => {
        store.setTimeLeft(getDuration(store.mode));
    };

    const stop = () => {
        store.setStatus('idle');
        store.setMode('focus');
        store.setCycleCount(0);
        store.setTimeLeft(getDuration('focus'));
    };

    const skip = () => {
        if (store.mode === 'focus') {
            const nextCycle = store.cycleCount + 1;
            const nextMode =
                nextCycle % store.longBreakInterval === 0
                    ? 'long-break'
                    : 'short-break';
            switchMode(nextMode, false);
        } else {
            store.setCycleCount((c) => c + 1);
            switchMode('focus', false);
        }
    };

    const switchMode = (newMode: PomodoroMode, autostart?: boolean) => {
        store.setMode(newMode);
        store.setStatus(autostart ? 'running' : 'idle');
        store.setTimeLeft(getDuration(newMode));
    };

    return {
        mode: store.mode,
        status: store.status,
        timeLeft: store.timeLeft,
        cycleCount: store.cycleCount,
        activeTodoId: store.activeTodoId,
        activeTodoTitle: store.activeTodoTitle,
        start,
        pause,
        reset,
        stop,
        skip,
        switchMode,
        setActiveTodo: store.setActiveTodo,
    };
}
