"use client";

import { Button } from "@/components/ui/button";

interface PomodoroControlsProps {
    status: "idle" | "running" | "paused" | "finished";
    start: () => void;
    pause: () => void;
    reset: () => void;
}

export function PomodoroControls({ status, start, pause, reset }: PomodoroControlsProps) {
    return (
        <div className="flex gap-3 justify-center">
            {status !== "running" ? (
                <Button onClick={start} className="px-6">Start</Button>
            ) : (
                <Button onClick={pause} variant="secondary" className="px-6">Pause</Button>
            )}
            <Button onClick={reset} variant="outline" className="px-6">Reset</Button>
        </div>
    );
}
