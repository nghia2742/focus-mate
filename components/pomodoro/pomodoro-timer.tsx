"use client";

import { usePomodoro } from "@/hooks/use-pomodoro";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import { PomodoroControls } from "./pomodoro-controls";
import { PomodoroDisplay } from "./pomodoro-display";

export function PomodoroTimer() {
    const {
        mode, status, timeLeft, cycleCount,
        start, pause, reset, stop, skip,
        activeTodoTitle, setActiveTodo
    } = usePomodoro();

    return (
        <div className="scale-70 md:scale-100 relative w-fit flex flex-col items-center gap-4 md:gap-8 p-6 md:p-12 rounded-[40px] glass-panel backdrop-blur-xs transition-all duration-500">
            <div className="text-center space-y-1">
                <h2 className="text-sm font-bold tracking-[0.3em] text-black dark:text-white uppercase">
                    {mode.replace("-", " ")}
                </h2>
                <div className="text-black dark:text-white text-xs font-semibold opacity-60">
                    Cycle #{cycleCount + 1}
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
                <div className="flex items-center justify-center w-full py-4 min-w-lg md:scale-120">
                    <PomodoroDisplay timeLeft={timeLeft} />
                </div>

                {activeTodoTitle && (
                    <Badge variant="secondary" className="px-2 flex group max-w-[400px] ">
                        <p className="truncate">{activeTodoTitle}</p>
                        <button className="ml-2 invisible group-hover:visible" onClick={() => setActiveTodo(null, null)}>
                            <X className="size-4" />
                        </button>
                    </Badge>
                )}
            </div>

            <div className="scale-80 md:scale-100 w-full pt-4">
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