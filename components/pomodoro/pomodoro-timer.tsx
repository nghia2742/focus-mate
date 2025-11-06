"use client";

import { usePomodoro } from "@/hooks/use-pomodoro";
import { PomodoroControls } from "./pomodoro-controls";
import { PomodoroDisplay } from "./pomodoro-display";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TIMER } from "@/shared/constant";

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
    const elapsedPercent =
        total > 0
            ? Math.max(0, Math.min(100, Math.round(((total - timeLeft) / total) * 100)))
            : 0;

    return (
        <div className="relative flex flex-col items-center gap-6">
            <GlassCircle percent={elapsedPercent}>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold capitalize">{mode.replace("-", " ")}</h2>
                    <div className="text-6xl font-extrabold">
                        <PomodoroDisplay timeLeft={timeLeft} />
                    </div>
                </div>
            </GlassCircle>

            <PomodoroControls status={status} start={start} pause={pause} reset={reset} />

            <div className="text-gray-600 dark:text-gray-300 font-bold">🔥 {cycleCount}</div>
        </div>
    );
}

function GlassCircle({ percent, children }: { percent: number; children: React.ReactNode }) {
    const size = 340;
    const ring = 12;
    const inner = size - ring * 2;
    const radius = (size - ring) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, percent));
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* Progress ring outside the glass */}
            <svg className="absolute inset-0 -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(56,189,248,0.9)" />
                        <stop offset="100%" stopColor="rgba(59,130,246,0.9)" />
                    </linearGradient>
                </defs>
                {/* track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth={ring}
                    fill="none"
                />
                {/* progress */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#ring-grad)"
                    strokeWidth={ring}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </svg>

            {/* Inner glass content */}
            <div
                className={cn(
                    "absolute inset-[12px] rounded-full",
                    "backdrop-blur-xl border border-white/25",
                    "shadow-[inset_0_40px_80px_-40px_rgba(255,255,255,0.6),0_30px_80px_-20px_rgba(0,0,0,0.35)]",
                    "overflow-visible"
                )}
                style={{ width: inner, height: inner }}
            >
                {/* Subtle blue transparent liquid tint (no waves) */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(120%_100%_at_50%_20%,rgba(56,189,248,0.25),rgba(255,255,255,0.08)_55%,rgba(0,0,0,0.15)_100%)]" />
                {/* Inner highlight */}
                <div className="absolute inset-x-6 top-4 h-1/3 rounded-full bg-white/25 blur-2xl" />
                {/* Rim highlight */}
                <div className="absolute inset-0 rounded-full ring-1 ring-white/20" />

                {/* Centered timer */}
                <div className="absolute inset-0 grid place-items-center">{children}</div>
            </div>
        </div>
    );
}
