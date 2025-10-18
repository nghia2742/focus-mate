"use client";

import { usePomodoro } from "@/hooks/use-pomodoro";
import { PomodoroDisplay } from "./pomodoro-display";
import { PomodoroControls } from "./pomodoro-controls";

export function PomodoroTimer() {
    const { mode, status, timeLeft, cycleCount, start, pause, reset } = usePomodoro();

    return (
        <div className="p-8 text-center space-y-6">
            <h2 className="text-xl font-semibold capitalize">{mode.replace("-", " ")}</h2>
            {Array.from({ length: cycleCount }).map((_, idx) => <span key={idx}>🔥</span>)}
            <PomodoroDisplay timeLeft={timeLeft} />
            <PomodoroControls status={status} start={start} pause={pause} reset={reset} />
        </div>
    );
}
