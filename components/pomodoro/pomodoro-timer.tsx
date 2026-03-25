"use client";

import { usePomodoro } from "@/hooks/use-pomodoro";
import { PomodoroControls } from "./pomodoro-controls";
import { PomodoroDisplay } from "./pomodoro-display";

export function PomodoroTimer() {
    const { mode, status, timeLeft, cycleCount, start, pause, reset, stop, skip } = usePomodoro();

    return (
        <div className="relative flex flex-col items-center gap-8 p-12 rounded-[40px] glass-panel transition-all duration-500 hover:shadow-2xl">
            <div className="text-center space-y-1">
                <h2 className="text-sm font-bold tracking-[0.3em] text-black/30 dark:text-white/30 uppercase">
                    {mode.replace("-", " ")}
                </h2>
                <div className="text-black/20 dark:text-white/10 text-xs font-semibold">
                    Cycle #{cycleCount + 1}
                </div>
            </div>

            <div className="flex items-center justify-center w-full py-8 scale-110">
                <PomodoroDisplay timeLeft={timeLeft} />
            </div>

            <div className="w-full pt-4">
                <PomodoroControls
                    status={status}
                    start={start}
                    pause={pause}
                    reset={reset}
                    stop={stop}
                    skip={skip}
                />
            </div>
        </div>
    );
}