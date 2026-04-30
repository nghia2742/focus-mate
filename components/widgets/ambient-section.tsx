"use client";

import { cn } from "@/lib/utils";
import { useAmbient, type AmbientKey } from "@/store/use-ambient";
import {
    CloudRain,
    Coffee,
    Flame,
    TreePine,
    Volume2,
    VolumeX,
    Waves,
    Wind,
} from "lucide-react";

export const AMBIENT: Record<AmbientKey, { name: string; icon: React.ElementType; file: string | null; color: string }> = {
    none: { name: "None", icon: VolumeX, file: null, color: "text-slate-400" },
    rain: { name: "Rain", icon: CloudRain, file: "/sounds/background-sounds/rain/rain_1.mp3", color: "text-sky-400" },
    fire: { name: "Fire", icon: Flame, file: "/sounds/background-sounds/fire/fire_1.mp3", color: "text-orange-400" },
    windy: { name: "Wind", icon: Wind, file: "/sounds/background-sounds/windy/windy_1.mp3", color: "text-teal-400" },
    waves: { name: "Waves", icon: Waves, file: "/sounds/background-sounds/waves/waves.mp3", color: "text-blue-400" },
    forest: { name: "Forest", icon: TreePine, file: "/sounds/background-sounds/forest/forest.mp3", color: "text-green-400" },
    cafe: { name: "Café", icon: Coffee, file: "/sounds/background-sounds/cafe/cafe.mp3", color: "text-amber-400" },
};

export function AmbientSection() {
    const { activeSound, volume, toggleSound, setVolume } = useAmbient();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] glass-text-faint">Ambient Atmosphere</p>
                {activeSound !== "none" && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold text-violet-400 animate-pulse">
                        <span className="size-1 rounded-full bg-violet-400" />
                        Active
                    </span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-3">
                {(Object.keys(AMBIENT) as AmbientKey[]).map((key) => {
                    const s = AMBIENT[key];
                    const Icon = s.icon;
                    const isActive = activeSound === key;
                    
                    if (key === "none") return null;

                    return (
                        <button
                            key={key}
                            onClick={() => toggleSound(key)}
                            className={cn(
                                "flex flex-col items-center gap-3 p-4 rounded-2xl transition-all text-center border relative group",
                                isActive 
                                    ? "glass inner-glass-border scale-[1.02]" 
                                    : "inner-glass-bg border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]"
                            )}
                        >
                            <div className={cn(
                                "size-12 rounded-xl flex items-center justify-center transition-all duration-300",
                                isActive ? "bg-violet-500/20" : "inner-glass-bg group-hover:bg-white/5"
                            )}>
                                <Icon className={cn("size-6 transition-transform duration-500", isActive ? s.color + " scale-110" : "glass-text-muted")} />
                            </div>
                            <span className={cn("text-[11px] font-bold tracking-tight transition-colors", isActive ? "glass-text" : "glass-text-muted")}>{s.name}</span>
                            
                            {isActive && (
                                <div className="absolute -top-1 -right-1 size-3 bg-violet-500 rounded-full border-2 border-white/20" />
                            )}
                        </button>
                    );
                })}
            </div>
            {activeSound !== "none" && (
                <div className="flex flex-col gap-4 mt-2 p-5 glass-panel-subtle rounded-2xl border inner-glass-border">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold glass-text uppercase tracking-wider flex items-center gap-2">
                            <Volume2 className="size-4 text-violet-400" />
                            Intensity
                        </span>
                        <span className="text-xs font-mono font-bold glass-text-muted">{volume}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100" value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full accent-violet-500 h-1.5 rounded-lg appearance-none cursor-pointer inner-glass-bg transition-all hover:accent-violet-400"
                    />
                </div>
            )}
        </div>
    );
}
