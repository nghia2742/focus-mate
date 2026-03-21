"use client";

import { Leaderboard } from "@/components/dashboard/leaderboard";
import { OverviewStats } from "@/components/dashboard/overview-stats";

export default function OverviewPage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
                <OverviewStats />
            </div>
            <div className="space-y-6">
                <Leaderboard />
            </div>
        </div>
    );
}
