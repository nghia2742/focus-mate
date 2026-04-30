"use client";

import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function GoalWidget() {
    const [sessions, setSessions] = useState(4);
    const goal = 8;
    const pct = Math.min(100, (sessions / goal) * 100);
    const circumference = 2 * Math.PI * 56;

    return (
        <div className="flex flex-col items-center gap-8 h-full p-8 pt-14">
             <DialogHeader className="sr-only">
                <DialogTitle>Daily Goal</DialogTitle>
            </DialogHeader>
            <div className="relative size-48 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="glass-text-faint" strokeOpacity="0.15" />
                    <circle cx="64" cy="64" r="56" fill="none" stroke="url(#goalGrad)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)} style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                    <defs>
                        <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold glass-text">{sessions}</span>
                    <span className="text-sm glass-text-faint font-medium">of {goal} sessions</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold glass-text">Focus Progress</p>
                <p className="text-base glass-text-muted mt-2">{goal - sessions > 0 ? `${goal - sessions} more to go!` : "You've reached your goal! 🏆"}</p>
            </div>
            <div className="flex items-center gap-6 mt-4">
                <button onClick={() => setSessions(s => Math.max(0, s - 1))} className="size-12 rounded-2xl glass hover-glass glass-text flex items-center justify-center text-2xl font-bold transition-all hover:scale-105 active:scale-95">−</button>
                <span className="glass-text font-mono text-2xl w-10 text-center">{sessions}</span>
                <button onClick={() => setSessions(s => Math.min(goal, s + 1))} className="size-12 rounded-2xl glass hover-glass glass-text flex items-center justify-center text-2xl font-bold transition-all hover:scale-105 active:scale-95">+</button>
            </div>
        </div>
    );
}
