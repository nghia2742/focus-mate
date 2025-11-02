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

    return (
        <div className="relative flex flex-col items-center gap-5">
            {/* Heading + time */}
            <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold capitalize">{mode.replace("-", " ")}</h2>
                <div className="text-6xl font-extrabold">
                    <PomodoroDisplay timeLeft={timeLeft} />
                </div>
            </div>

            {/* Minimal 3D Glass Liquid Progress Bar (fills up with time) */}
            <GlassLiquidBar percent={elapsedPercent} />

            {/* Controls */}
            <PomodoroControls status={status} start={start} pause={pause} reset={reset} />

            <div className="text-gray-600 dark:text-gray-300 font-bold">🔥 {cycleCount}</div>
        </div>
    );
}

function GlassLiquidBar({ percent }: { percent: number }) {
    const width = 560;
    const height = 88;
    const radius = 28;

    const clamped = Math.max(0, Math.min(100, percent));
    const fillWidth = (width * clamped) / 100;

    return (
        <div
            className={cn(
                "relative",
                "rounded-[28px] p-[2px]",
                "backdrop-blur-xl",
                "shadow-[inset_0_20px_40px_-30px_rgba(255,255,255,0.6),0_20px_60px_-20px_rgba(0,0,0,0.35)]",
                "border border-white/30"
            )}
            style={{ width, height }}
        >
            {/* Outer glossy shell */}
            <div
                className="absolute inset-0 rounded-[26px] pointer-events-none"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 100%)",
                }}
            />
            {/* Inner container */}
            <div className="absolute inset-[6px] rounded-[22px] overflow-hidden bg-white/5 border border-white/15">
                {/* Top highlight */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.35),transparent)] pointer-events-none" />
                {/* Liquid mask area */}
                <svg
                    className="absolute inset-0"
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                >
                    <defs>
                        <clipPath id="bar-clip">
                            <rect x="6" y="6" width={width - 12} height={height - 12} rx={radius - 8} ry={radius - 8} />
                        </clipPath>
                        <linearGradient id="water-grad-bar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(56,189,248,0.65)" />
                            <stop offset="100%" stopColor="rgba(59,130,246,0.55)" />
                        </linearGradient>
                    </defs>

                    <g clipPath="url(#bar-clip)">
                        {/* Background tint */}
                        <rect x="6" y="6" width={width - 12} height={height - 12} fill="rgba(255,255,255,0.02)" />

                        {/* Static base fill to reduce visual emptiness on low percent */}
                        <rect x="6" y="6" width={Math.max(6, fillWidth)} height={height - 12} fill="url(#water-grad-bar)" opacity="0.6" />

                        {/* Wave groups positioned at current fill width */}
                        <g transform={`translate(6,0)`}>
                            <motion.g
                                animate={{ x: [-120, 0] }}
                                transition={{ duration: 6.5, ease: "linear", repeat: Infinity }}
                                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                            >
                                <path
                                    d={generateHorizontalWave(fillWidth, height - 12, 10, 120)}
                                    transform={`translate(0,6)`}
                                    fill="url(#water-grad-bar)"
                                    opacity="0.9"
                                />
                            </motion.g>
                            <motion.g
                                animate={{ x: [0, -140] }}
                                transition={{ duration: 8.5, ease: "linear", repeat: Infinity }}
                                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                            >
                                <path
                                    d={generateHorizontalWave(fillWidth, height - 12, 6, 160)}
                                    transform={`translate(0,6)`}
                                    fill="url(#water-grad-bar)"
                                    opacity="0.75"
                                />
                            </motion.g>
                        </g>

                        {/* Edge gloss where liquid meets air */}
                        <rect x={6} y={6} width={Math.max(6, fillWidth)} height={2} fill="white" opacity="0.25" />
                    </g>
                </svg>

                {/* Subtle glare sweep */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={false}
                    animate={{
                        background: [
                            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 45%, transparent 60%)",
                            "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.10) 38%, transparent 55%)",
                        ],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}

/**
 * Generate a horizontal wave shape filling a given width and full height of the inner bar.
 * The wave is drawn from left to right and closes to the bottom to fill the liquid area.
 */
function generateHorizontalWave(width: number, height: number, amplitude: number, wavelength: number) {
    const w = Math.max(0, width);
    if (w <= 0) return `M 0 ${height} L 0 ${height} Z`;
    const step = 8;
    const points: string[] = [];
    for (let x = -wavelength * 2; x <= w + wavelength * 2; x += step) {
        const y = height / 2 + Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
        points.push(`${x},${y}`);
    }
    const path = `M 0 ${height} L 0 ${points.length ? points[0].split(",")[1] : height / 2} ` +
        points.map(p => `L ${p}`).join(" ") +
        ` L ${w} ${height} Z`;
    return path;
}
