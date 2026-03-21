"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query
} from "firebase/firestore";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface UserStat {
    id: string;
    displayName: string;
    photoURL: string;
    totalFocusMinutes: number;
}

export function Leaderboard() {
    const [leaders, setLeaders] = useState<UserStat[]>([]);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const q = query(
                    collection(db, "users"),
                    orderBy("totalFocusMinutes", "desc"),
                    limit(5)
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as UserStat));
                setLeaders(data);
            } catch (error) {
                console.error("Error fetching leaderboard", error);
            }
        };

        fetchLeaders();
    }, []);

    return (
        <div className="glass p-4 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Leaderboard
            </h3>

            <div className="space-y-3">
                {leaders.map((user, index) => (
                    <div key={user.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                        <div className="font-bold text-white/50 w-6 text-center">#{index + 1}</div>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL} />
                            <AvatarFallback>{user.displayName?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-medium text-white truncate">{user.displayName || "Anonymous"}</div>
                            <div className="text-xs text-white/50">{user.totalFocusMinutes || 0} mins</div>
                        </div>
                    </div>
                ))}
                {leaders.length === 0 && (
                    <div className="text-white/40 text-sm text-center">No data yet.</div>
                )}
            </div>
        </div>
    );
}
