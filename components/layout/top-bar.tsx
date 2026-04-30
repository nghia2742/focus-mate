"use client";

import { AuthButton } from "@/components/auth/auth-button";
import { Flame, Clock } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useDailyStats } from "@/hooks/use-daily-stats";

export function TopBar() {
    const { data: profile } = useProfile();
    const { data: dailyStats } = useDailyStats();
    
    const streak = profile?.current_streak || 0;
    const totalToday = dailyStats?.total_minutes || 0;

    return (
        <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
            {/* Top Left: Stats */}
            <div className="pointer-events-auto flex items-center gap-3">
                {/* Streak */}
                <div 
                    className="glass-panel backdrop-blur-md border border-white/10 px-3 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-white/5 transition-all cursor-pointer group"
                    title="Current Streak"
                >
                    <div className="relative">
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500/50" />
                        <div className="absolute inset-0 bg-orange-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <span className="text-white font-bold text-sm">{streak}</span>
                </div>

                {/* Total Focus Today */}
                <div 
                    className="glass-panel backdrop-blur-md border border-white/10 px-3 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-white/5 transition-all cursor-pointer group"
                    title="Focus minutes today"
                >
                    <div className="relative">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        <div className="absolute inset-0 bg-emerald-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <span className="text-white font-bold text-sm">{totalToday}</span>
                </div>
            </div>

            {/* Top Right: Auth */}
            <div className="pointer-events-auto">
                <AuthButton />
            </div>
        </div>
    );
}
