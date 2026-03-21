"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePomodoro } from "@/hooks/use-pomodoro";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useFocusStore } from "@/store/use-focus-store";
import { useSettings } from "@/store/use-settings";
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Flame, Lock, Target, Unlock } from "lucide-react";
import { useEffect } from "react";
import { PomodoroControls } from "./pomodoro-controls";
import { PomodoroDisplay } from "./pomodoro-display";

export function PomodoroTimer() {
    const { mode, status, timeLeft, cycleCount, start, pause, reset } = usePomodoro();
    const { focusMinutes, shortBreakMinutes, longBreakMinutes } = useSettings();
    const { currentTask, isLockedMode, setLockedMode } = useFocusStore();
    const { user } = useAuth();

    // Sound effect for timer completion could go here - handled by hook

    // Persistence Logic
    useEffect(() => {
        if (status === 'finished' && mode === 'focus' && user) {
            const saveSession = async () => {
                try {
                    // 1. Save Session Log
                    await addDoc(collection(db, "focusSessions"), {
                        userId: user.uid,
                        taskId: currentTask?.id || null,
                        taskTitle: currentTask?.title || "Focus Session",
                        duration: focusMinutes,
                        completedAt: serverTimestamp(),
                    });

                    // 2. Update User Stats
                    await updateDoc(doc(db, "users", user.uid), {
                        totalFocusMinutes: increment(focusMinutes),
                        monthlyFocusMinutes: increment(focusMinutes),
                        lastFocusAt: serverTimestamp(),
                        // Streak logic to be improved (check date diff)
                    });

                    // 3. Unlock screen if locked
                    if (isLockedMode) {
                        setLockedMode(false);
                    }
                } catch (error) {
                    console.error("Error saving focus session:", error);
                }
            };
            saveSession();
        }
    }, [status, mode, user, focusMinutes, currentTask, isLockedMode, setLockedMode]);

    // Save session when timer finishes (logic to be improved with proper callback from hook)
    // For now, we will add a simple effect to watch for mode changes or completion if possible.
    // However, without modifying the hook to return 'completed' state or callback, exact syncing is hard.
    // Let's assume we modify the hook or simply add a manual "Finish" button for now, 
    // OR we watch timeLeft === 0.

    // Better approach: Watch timeLeft. If it hits 0 and status was 'running', trigger save.
    // But status changes to 'idle' or 'paused' when it hits 0 usually.

    // Let's modify the hook later. for now, let's just show the task and lock button.

    const getTotalDuration = (m: string) => {
        switch (m) {
            case "focus":
                return focusMinutes * 60;
            case "short-break":
                return shortBreakMinutes * 60;
            case "long-break":
                return longBreakMinutes * 60;
            default:
                return focusMinutes * 60;
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
                <div className="text-center space-y-2 z-10">
                    <h2 className="text-xl font-semibold capitalize text-white/80">{mode.replace("-", " ")}</h2>
                    <div className="text-6xl font-extrabold text-white">
                        <PomodoroDisplay timeLeft={timeLeft} />
                    </div>
                    {mode === 'focus' && currentTask && (
                        <div className="mt-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                            <span className="text-sm text-blue-200 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                {currentTask.title}
                            </span>
                        </div>
                    )}
                </div>
            </GlassCircle>

            <div className="flex flex-col items-center gap-4">
                <PomodoroControls status={status} start={start} pause={pause} reset={reset} />

                <div className="flex items-center gap-4">
                    <div className="text-white/80 font-bold flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-400" />
                        {cycleCount}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLockedMode(!isLockedMode)}
                        className={cn("text-white/60 hover:text-white", isLockedMode && "text-blue-400 bg-blue-500/10")}
                        title="Toggle Lock-in Mode"
                    >
                        {isLockedMode ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
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
