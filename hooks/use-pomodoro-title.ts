'use client';

import { useEffect } from 'react';
import { PomodoroMode, PomodoroStatus } from './use-pomodoro-types';

/**
 * Hook to manage the document title reflecting the current timer state.
 */
export function usePomodoroTitle(status: PomodoroStatus, timeLeft: number, mode: PomodoroMode) {
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const defaultTitle = 'Focus Mate';

        if (status === 'running') {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            let modeStr = '';
            switch (mode) {
                case 'focus': 
                    modeStr = 'Focus'; 
                    break;
                case 'short-break': 
                    modeStr = 'Short Break'; 
                    break;
                case 'long-break': 
                    modeStr = 'Long Break'; 
                    break;
            }

            document.title = `${timeStr} ${modeStr} - ${defaultTitle}`;
        } else if (status === 'paused') {
            document.title = `Paused - ${defaultTitle}`;
        } else {
            document.title = defaultTitle;
        }

        // Cleanup: Reset title on unmount
        return () => {
            document.title = defaultTitle;
        };
    }, [status, timeLeft, mode]);
}
