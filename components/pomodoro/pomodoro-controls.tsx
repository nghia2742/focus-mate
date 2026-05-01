"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, Square, SkipForward, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <TooltipProvider>
            <div className="flex items-center gap-4 justify-center">
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="glass"
                            onClick={stop}
                            className="w-12 h-12 rounded-full transition-all duration-300"
                        >
                            <Square className="w-5 h-5 fill-current" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={6} className="glass border-none text-foreground font-medium px-4 py-2 rounded-xl backdrop-blur-xl">
                        Stop and Reset All
                    </TooltipContent>
                </Tooltip>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                size="lg"
                                onClick={isRunning ? pause : start}
                                className={cn(
                                    "relative px-8 h-14 rounded-full font-bold text-lg transition-all duration-300",
                                    "backdrop-blur-xl shadow-2xl",
                                    isRunning 
                                        ? "glass border-primary/20 text-foreground" 
                                        : "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20"
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
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={6} className="glass border-none text-foreground font-medium px-4 py-2 rounded-xl backdrop-blur-xl">
                            {isRunning ? "Pause the session" : "Start your focus session"}
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="glass"
                                onClick={skip}
                                className="w-12 h-12 rounded-full transition-all duration-300"
                            >
                                <SkipForward className="w-5 h-5 fill-current" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={6} className="glass border-none text-foreground font-medium px-4 py-2 rounded-xl backdrop-blur-xl">
                            Skip to Next Phase
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="glass"
                                onClick={reset}
                                className="w-12 h-12 rounded-full transition-all duration-300"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" sideOffset={6} className="glass border-none text-foreground font-medium px-4 py-2 rounded-xl backdrop-blur-xl">
                            Reset Current Phase
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}
