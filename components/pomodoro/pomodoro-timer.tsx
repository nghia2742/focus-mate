"use client";

import { usePomodoro } from "@/hooks/use-pomodoro";
import { Target, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { PomodoroControls } from "./pomodoro-controls";
import { PomodoroDisplay } from "./pomodoro-display";

export function PomodoroTimer() {
    const {
        mode, status, timeLeft, cycleCount,
        start, pause, reset, stop, skip,
        activeTodoTitle, setActiveTodo
    } = usePomodoro();

    return (
        <div className="relative flex flex-col items-center gap-8 p-12 rounded-[40px] glass-panel backdrop-blur-xs transition-all duration-500">
            <div className="text-center space-y-1">
                <h2 className="text-sm font-bold tracking-[0.3em] text-black dark:text-white uppercase">
                    {mode.replace("-", " ")}
                </h2>
                <div className="text-black dark:text-white text-xs font-semibold opacity-60">
                    Cycle #{cycleCount + 1}
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
                <div className="flex items-center justify-center w-full py-4 scale-110">
                    <PomodoroDisplay timeLeft={timeLeft} />
                </div>

                {activeTodoTitle && (
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full glass bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Focusing on:</span>
                        <span className="text-xs font-medium text-white truncate max-w-[150px]">{activeTodoTitle}</span>
                        <button 
                            onClick={() => setActiveTodo(null, null)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                        >
                            <XCircle className="size-4" />
                        </button> */}
                        <Badge variant="secondary">
                            <Target data-icon="inline-start" />
                            {activeTodoTitle}
                            <Button onClick={() => setActiveTodo(null, null)}>
                                <XCircle className="size-4" />
                            </Button>
                        </Badge>
                    </div>
                )}
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