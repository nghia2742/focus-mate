"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, Square, SkipForward, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PomodoroControlsProps {
    status: "idle" | "running" | "paused" | "finished";
    start: () => void;
    pause: () => void;
    reset: () => void;
    stop: () => void;
    skip: () => void;
}

export function PomodoroControls({ status, start, pause, reset, stop, skip }: PomodoroControlsProps) {
    const isRunning = status === "running";

    return (
        <div className="flex items-center gap-4 justify-center">
            <Button
                size="icon"
                variant="ghost"
                onClick={stop}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all duration-300"
                title="Stop and Reset All"
            >
                <Square className="w-5 h-5 fill-current" />
            </Button>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Button
                    size="lg"
                    onClick={isRunning ? pause : start}
                    className={cn(
                        "relative px-8 h-14 rounded-full font-bold text-lg transition-all duration-300",
                        "backdrop-blur-xl border border-white/20 shadow-2xl",
                        isRunning 
                            ? "bg-white/10 hover:bg-white/20 text-white" 
                            : "bg-white text-blue-600 hover:bg-blue-50"
                    )}
                >
                    {isRunning ? (
                        <div className="flex items-center gap-2">
                            <Pause className="w-6 h-6 fill-current" />
                            <span>Pause</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Play className="w-6 h-6 fill-current" />
                            <span>Start</span>
                        </div>
                    )}
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={skip}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all duration-300"
                    title="Skip to Next Phase"
                >
                    <SkipForward className="w-5 h-5 fill-current" />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={reset}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all duration-300"
                    title="Reset Current Phase"
                >
                    <RotateCcw className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
