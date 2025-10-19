"use client";

import { TIMER, usePomodoro } from "@/hooks/use-pomodoro";
import { PomodoroControls } from "./pomodoro-controls";
import { PomodoroDisplay } from "./pomodoro-display";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function PomodoroTimer() {
    const { mode, status, timeLeft, cycleCount, start, pause, reset } = usePomodoro();

    const getTotalDuration = (m: string) => {
        switch (m) {
            case "focus":
                return TIMER.FOCUS;
            case "short-break":
                return TIMER.SHORT_BREAK;
            case "long-break":
                return TIMER.LONG_BREAK;
            default:
                return TIMER.FOCUS;
        }
    };

    const total = getTotalDuration(mode);
    const percent =
        total > 0
            ? Math.max(0, Math.min(100, Math.round(((total - timeLeft) / total) * 100)))
            : 0;

    // SVG ring parameters
    const size = 360; // SVG viewport
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className={cn(
                "relative flex flex-col items-center justify-center aspect-square rounded-full select-none"
            )}
            style={{ width: size, height: size }}
        >
            {/* SVG RING */}
            <svg
                className="absolute inset-0 -rotate-90"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* progress */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#22c55e"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </svg>

            {/* CONTENT */}
            <div className="text-center space-y-3 z-10">
                <h2 className="text-xl font-semibold capitalize">{mode.replace("-", " ")}</h2>
                <PomodoroDisplay timeLeft={timeLeft} />
                <PomodoroControls status={status} start={start} pause={pause} reset={reset} />
                <div className="text-gray-500 font-bold">🔥 {cycleCount}</div>
            </div>
        </div>
    );
}
