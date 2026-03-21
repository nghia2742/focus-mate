"use client";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Clock, Flame } from "lucide-react";
import { useEffect, useState } from "react";

interface UserStats {
    streak: number;
    monthlyFocusMinutes: number;
    totalFocusMinutes: number;
}

export function OverviewStats() {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
            const data = doc.data();
            if (data) {
                setStats({
                    streak: data.streak || 0,
                    monthlyFocusMinutes: data.monthlyFocusMinutes || 0,
                    totalFocusMinutes: data.totalFocusMinutes || 0,
                });
            }
        });

        return () => unsubscribe();
    }, [user]);

    if (!user) return null;

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Streak Card */}
            <div className="glass p-4 rounded-xl flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-white/60 text-xs uppercase tracking-wider">Streak</span>
                    <span className="text-white text-2xl font-bold">{stats?.streak || 0}</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-orange-400" />
                </div>
            </div>

            {/* Focus Time Card */}
            <div className="glass p-4 rounded-xl flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-white/60 text-xs uppercase tracking-wider">Month</span>
                    <span className="text-white text-2xl font-bold">
                        {Math.floor((stats?.monthlyFocusMinutes || 0) / 60)}h {(stats?.monthlyFocusMinutes || 0) % 60}m
                    </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-400" />
                </div>
            </div>
        </div>
    );
}
