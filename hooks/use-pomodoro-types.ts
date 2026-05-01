'use client';

export type PomodoroMode = 'focus' | 'short-break' | 'long-break';
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface UsePomodoroOptions {
    focusDuration?: number; // seconds
    shortBreakDuration?: number;
    longBreakDuration?: number;
    longBreakInterval?: number;
}
