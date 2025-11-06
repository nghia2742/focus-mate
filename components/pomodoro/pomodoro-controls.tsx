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
                <Button
                    onClick={start}
                    className="px-6 rounded-full backdrop-blur-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)]"
                >
                    Start
                </Button>
            ) : (
                <Button
                    onClick={pause}
                    className="px-6 rounded-full bg-white/20 border border-white/20 hover:bg-white/30 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]"
                    variant="secondary"
                >
                    Pause
                </Button>
            )}
            <Button
                onClick={reset}
                className="px-6 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]"
                variant="outline"
            >
                Reset
            </Button>
        </div>
    );
}
