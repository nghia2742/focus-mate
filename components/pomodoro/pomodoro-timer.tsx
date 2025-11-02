"use client";

import { TIMER, usePomodoro } from "@/hooks/use-pomodoro";
import { PomodoroControls } from "./pomodoro-controls";
import { PomodoroDisplay } from "./pomodoro-display";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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

    // Dimensions for sphere
    const size = 460;

    return (
        <div className="relative flex flex-col items-center gap-4">
            <div className="text-center space-y-2 z-10">
                <h2 className="text-xl font-semibold capitalize">{mode.replace("-", " ")}</h2>
                <div className="text-6xl font-extrabold">
                    <PomodoroDisplay timeLeft={timeLeft} />
                </div>
            </div>

            {/* Glass sphere shows when timer starts (and remains during pause), hides when idle */}
            <AnimatePresence>
                {status !== "idle" && (
                    <motion.div
                        key="sphere"
                        initial={{ opacity: 0, scale: 0.9, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.35 }}
                        className="relative"
                        style={{ width: size, height: size }}
                    >
                        <GlassSphere remainingPercent={remainingPercent} />
                    </motion.div>
                )}
            </AnimatePresence>

            <PomodoroControls status={status} start={start} pause={pause} reset={reset} />
            <div className="text-gray-600 dark:text-gray-300 font-bold">🔥 {cycleCount}</div>
        </div>
    );
}

function GlassSphere({ remainingPercent }: { remainingPercent: number }) {
    const size = 460;
    const r = size / 2;

    return (
        <div
            className={cn(
                "rounded-full",
                "backdrop-blur-xl",
                "shadow-[inset_0_40px_80px_-40px_rgba(255,255,255,0.6),0_30px_80px_-20px_rgba(0,0,0,0.35)]",
                "border border-white/30",
                "relative"
            )}
            style={{ width: size, height: size }}
        >
            {/* Inner 3D gradients to emulate depth */}
            <div className="absolute inset-0 rounded-full overflow-visible">
                {/* Spherical inner shading */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(120%_100%_at_50%_20%,rgba(255,255,255,0.65),rgba(255,255,255,0.15)_45%,rgba(255,255,255,0.05)_60%,rgba(0,0,0,0.25)_100%)]" />
                {/* Top-left specular highlight */}
                <div className="absolute -top-4 -left-2 h-1/3 w-1/3 rounded-full bg-white/50 blur-2xl" />
                {/* Rim highlight */}
                <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />
            </div>

            {/* Liquid waves masked to the sphere */}
            <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <clipPath id="sphere-clip">
                        <circle cx={r} cy={r} r={r - 2} />
                    </clipPath>
                    <linearGradient id="liquid-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(56,189,248,0.95)" />
                        <stop offset="100%" stopColor="rgba(99,102,241,0.95)" />
                    </linearGradient>
                </defs>

                <g clipPath="url(#sphere-clip)">
                    {/* Base inner shade for depth */}
                    <rect width={size} height={size} fill="url(#liquid-grad)" opacity="0.15" />

                    {/* Dynamic waves - two layers, opposite directions */}
                    <motion.g
                        animate={{ x: [-size, 0] }}
                        transition={{ duration: 7, ease: "linear", repeat: Infinity }}
                    >
                        <path
                            d={generateWavePath(size, size, levelFromPercent(size, remainingPercent), 14, 120)}
                            fill="url(#liquid-grad)"
                            opacity="0.95"
                        />
                    </motion.g>
                    <motion.g
                        animate={{ x: [0, -size] }}
                        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                    >
                        <path
                            d={generateWavePath(size, size, levelFromPercent(size, remainingPercent), 10, 170)}
                            fill="url(#liquid-grad)"
                            opacity="0.8"
                        />
                    </motion.g>

                    {/* Caustics-like highlight moving slowly */}
                    <motion.rect
                        x="-30%"
                        y="0"
                        width="160%"
                        height="50%"
                        fill="white"
                        opacity="0.06"
                        animate={{ y: [r * 0.3, r * 0.4, r * 0.35] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                </g>
            </svg>

            {/* Front glass glare sweep */}
            <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={false}
                animate={{ background: ["radial-gradient(40%_20%_at_30%_25%,rgba(255,255,255,0.35),transparent_60%)", "radial-gradient(45%_22%_at_28%_22%,rgba(255,255,255,0.45),transparent_60%)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Bottom shadow for floating effect */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 h-6 w-2/3 rounded-full bg-black/20 blur-2xl" />
        </div>
    );
}

/**
 * Generate a sine wave path that fills the bottom area up to the given level.
 */
function generateWavePath(width: number, height: number, level: number, amplitude: number, wavelength: number) {
    const points: string[] = [];
    const step = 8;
    const startX = -wavelength * 2;
    for (let x = startX; x <= width + wavelength * 2; x += step) {
        const y = level + Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
        points.push(`${x},${y}`);
    }
    const path = `M ${startX},${height} L ${startX},${points.length ? points[0].split(",")[1] : level} ` +
        points.map(p => `L ${p}`).join(" ") +
        ` L ${width + wavelength * 2},${height} Z`;
    return path;
}

/** Map remaining percent (0..100) to y level in px from top, keeping some margin to see waves */
function levelFromPercent(height: number, remainingPercent: number) {
    const clamped = Math.max(0, Math.min(100, remainingPercent));
    const level = height * (1 - clamped / 100);
    const margin = Math.max(12, height * 0.06);
    return Math.min(height - margin, Math.max(margin, level));
}
