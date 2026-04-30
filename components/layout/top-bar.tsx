"use client";

import { AuthButton } from "@/components/auth/auth-button";
import { Flame } from "lucide-react";

export function TopBar() {
    return (
        <div className="fixed top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
            {/* Top Left: Streak */}
            <div className="pointer-events-auto">
                <div className="glass-panel backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="relative">
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                        <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-white font-bold text-sm">0</span>
                        <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">Days Streak</span>
                    </div>
                </div>
            </div>

            {/* Top Right: Auth */}
            <div className="pointer-events-auto">
                <AuthButton />
            </div>
        </div>
    );
}
