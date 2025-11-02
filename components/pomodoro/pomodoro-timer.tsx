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
    const elapsedPercent =
        total > 0
            ? Math.max(0, Math.min(100, Math.round(((total - timeLeft) / total) * 100)))
            : 0;
    const remainingPercent = 100 - elapsedPercent;

    // Dimensions
    const size = 420; // container size
    const ring = 14;  // border thickness
    const inner = size - ring * 2;

    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={elapsedPercent}
            className={cn(
                "relative select-none",
                "rounded-full",
                // Outer glass ring
                "before:absolute before:inset-0 before:rounded-full before:bg-white/40 before:blur-[2px] before:content-['']",
                "after:absolute after:inset-[2px] after:rounded-full after:bg-gradient-to-b after:from-white/40 after:to-white/10 after:content-['']",
                "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)]"
            )}
            style={{ width: size, height: size, padding: ring }}
        >
            {/* Inner glass bowl with wave water */}
            <div
                className="relative rounded-full overflow-hidden backdrop-blur-sm bg-white/5 border border-white/20"
                style={{ width: inner, height: inner }}
            >
                {/* Gradient sheen */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.35),transparent_60%)]" />

                {/* Waves container clipped to circle */}
                <svg
                    className="absolute inset-0"
                    width={inner}
                    height={inner}
                    viewBox={`0 0 ${inner} ${inner}`}
                    preserveAspectRatio="none"
                >
                    <defs>
                        <clipPath id="bowl-clip">
                            <circle cx={inner / 2} cy={inner / 2} r={inner / 2} />
                        </clipPath>
                        <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(56,189,248,0.85)" />
                            <stop offset="100%" stopColor="rgba(59,130,246,0.85)" />
                        </linearGradient>
                    </defs>

                    <g clipPath="url(#bowl-clip)">
                        {/* Wave level (y) goes up/down with remainingPercent */}
                        {/*
                          We render two sine waves moving in opposite directions to create a liquid feel.
                          The baseline of the waves moves according to remainingPercent.
                        */}
                        <motion.g
                            animate={{ x: [-inner, 0] }}
                            transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                        >
                            <path
                                d={generateWavePath(inner, inner, levelFromPercent(inner, remainingPercent), 12, 80)}
                                fill="url(#water-grad)"
                                opacity="0.9"
                            />
                        </motion.g>
                        <motion.g
                            animate={{ x: [0, -inner] }}
                            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                        >
                            <path
                                d={generateWavePath(inner, inner, levelFromPercent(inner, remainingPercent), 8, 120)}
                                fill="url(#water-grad)"
                                opacity="0.75"
                            />
                        </motion.g>

                        {/* Subtle light refraction overlay */}
                        <rect width={inner} height={inner} fill="url(#glassHighlight)" opacity="0.0" />
                    </g>
                </svg>

                {/* CONTENT */}
                <div className="absolute inset-0 grid place-items-center text-center z-10">
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold capitalize drop-shadow-sm">{mode.replace("-", " ")}</h2>
                        <div className="text-6xl font-extrabold drop-shadow-sm">
                            <PomodoroDisplay timeLeft={timeLeft} />
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <PomodoroControls status={status} start={start} pause={pause} reset={reset} />
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 font-bold drop-shadow">🔥 {cycleCount}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Generate a sine wave path that fills the bottom area up to the given level.
 * width, height: svg viewport
 * level: y coordinate (from top) where the wave baseline sits
 * amplitude: peak height of the wave
 * wavelength: distance between peaks
 */
function generateWavePath(width: number, height: number, level: number, amplitude: number, wavelength: number) {
    const points: string[] = [];
    const step = 8;
    const startX = -wavelength * 2;
    for (let x = startX; x <= width + wavelength * 2; x += step) {
        const y = level + Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
        points.push(`${x},${y}`);
    }
    // Close shape to fill below the wave
    const path = `M ${startX},${height} L ${startX},${points.length ? points[0].split(",")[1] : level} ` +
        points.map(p => `L ${p}`).join(" ") +
        ` L ${width + wavelength * 2},${height} Z`;
    return path;
}

/** Convert remaining percent (0..100) to y level in pixels from top */
function levelFromPercent(height: number, remainingPercent: number) {
    const clamped = Math.max(0, Math.min(100, remainingPercent));
    // 0% => near bottom, 100% => near top
    const level = height * (1 - clamped / 100);
    // keep some margin to see waves
    const margin = height * 0.06;
    return Math.min(height - margin, Math.max(margin, level));
}
