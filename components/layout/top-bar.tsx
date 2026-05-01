"use client";

import { AuthButton } from "@/components/auth/auth-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useDailyStats } from "@/hooks/use-daily-stats";
import { useProfile } from "@/hooks/use-profile";
import { useUser } from "@/hooks/use-user";
import { Clock, Flame, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function TopBar() {
    const { data: dailyStats } = useDailyStats();
    const { data: profile } = useProfile();

    const totalToday = dailyStats?.total_minutes || 0;
    const streak = profile?.current_streak || 0;

    return (
        <div className="fixed top-0 left-0 w-full px-4 py-2 flex justify-between items-center z-50 border-b-0 rounded-none border-x-0 transition-colors">
            {/* Top Left: Stats */}
            <div className="flex relative items-center gap-4 glass-panel p-2 px-4">
                <TooltipLock />
                {/* Streak */}
                <div
                    className="flex items-center gap-2"
                    title="Current Streak"
                >
                    <div className="relative flex items-center justify-center w-7 h-7 rounded-full inner-glass-bg inner-glass-border">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-[10px] glass-text-faint font-medium uppercase tracking-wider leading-none mb-0.5">Streak</span>
                        <span className="glass-text font-bold text-sm leading-none">{streak} <span className="glass-text-muted text-[10px] font-normal">days</span></span>
                    </div>
                </div>

                <div className="w-px h-5 inner-glass-bg"></div>

                {/* Total Focus Today */}
                <div
                    className="flex items-center gap-2"
                    title="Focus minutes today"
                >
                    <div className="relative flex items-center justify-center w-7 h-7 rounded-full inner-glass-bg inner-glass-border">
                        <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-[10px] glass-text-faint font-medium uppercase tracking-wider leading-none mb-0.5">Focus Today</span>
                        <span className="glass-text font-bold text-sm leading-none">{totalToday} <span className="glass-text-muted text-[10px] font-normal">min</span></span>
                    </div>
                </div>
            </div>

            {/* Top Right: Actions & Auth */}
            <div className="flex items-center gap-2">
                <AuthButton />
                <div className="w-px h-5 inner-glass-bg"></div>
                <ThemeToggle />
            </div>
        </div>
    );
}


function TooltipLock() {
    const { isAuthenticated } = useUser()
    if (isAuthenticated) return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Lock className="size-5 glass-text" />
            </TooltipTrigger>
            <TooltipContent className="glass border-none text-foreground font-medium px-4 py-2 rounded-xl backdrop-blur-xl">
                <p>Sign in to see your achievements.</p>
            </TooltipContent>
        </Tooltip>
    )
}