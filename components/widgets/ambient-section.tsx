"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
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
    Wind
} from "lucide-react";

export const AMBIENT: Record<AmbientKey, {
    name: string;
    icon: React.ElementType;
    file: string | null;
    color: string;
    activeBg: string;
    accent: string
}> = {
    none: { name: "None", icon: VolumeX, file: null, color: "text-slate-400", activeBg: "bg-slate-500/20", accent: "accent-slate-500" },
    rain: { name: "Rain", icon: CloudRain, file: "/sounds/background-sounds/rain/rain.mp3", color: "text-sky-400", activeBg: "bg-sky-500/20", accent: "accent-sky-500" },
    fire: { name: "Fire", icon: Flame, file: "/sounds/background-sounds/fire/fire_1.mp3", color: "text-orange-400", activeBg: "bg-orange-500/20", accent: "accent-orange-500" },
    windy: { name: "Wind", icon: Wind, file: "/sounds/background-sounds/windy/windy_1.mp3", color: "text-teal-400", activeBg: "bg-teal-500/20", accent: "accent-teal-500" },
    waves: { name: "Waves", icon: Waves, file: "/sounds/background-sounds/waves/waves.mp3", color: "text-blue-400", activeBg: "bg-blue-500/20", accent: "accent-blue-500" },
    forest: { name: "Forest", icon: TreePine, file: "/sounds/background-sounds/forest/forest.mp3", color: "text-green-400", activeBg: "bg-green-500/20", accent: "accent-green-500" },
    cafe: { name: "Café", icon: Coffee, file: "/sounds/background-sounds/cafe/cafe.mp3", color: "text-amber-400", activeBg: "bg-amber-500/20", accent: "accent-amber-500" },
};

export function AmbientSection() {
    const { activeSound, volume, toggleSound, setVolume } = useAmbient();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between h-8">
                <div className="flex items-center gap-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] glass-text-faint">Ambient Atmosphere</p>
                    <div className={cn("flex items-center transition-all duration-300", activeSound === "none" ? "opacity-0 pointer-events-none translate-x-[-10px]" : "opacity-100 translate-x-0")}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="p-1 rounded-lg hover:bg-white/10 transition-colors glass-text-faint hover:glass-text" title="Adjust Volume">
                                    <Volume2 className="size-3.5" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent side="right" align="start" sideOffset={12} className="w-64 bg-background/95 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold glass-text uppercase tracking-wider flex items-center gap-2">
                                            <Volume2 className={cn("size-4", activeSound !== "none" ? AMBIENT[activeSound].color : "text-blue-400")} />
                                            Volume
                                        </span>
                                        <span className="text-xs font-mono font-bold glass-text-muted">{volume}%</span>
                                    </div>
                                    <Slider
                                        min={0} max={100} value={[volume]}
                                        onValueChange={(vals) => setVolume(vals[0])}
                                        className={cn("w-full cursor-pointer", activeSound !== "none" ? AMBIENT[activeSound].color : "text-blue-500")}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
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
                                isActive ? AMBIENT[key].activeBg : "inner-glass-bg group-hover:bg-white/5"
                            )}>
                                <Icon className={cn("size-6 transition-transform duration-500", isActive ? s.color + " scale-110" : "glass-text-muted")} />
                            </div>
                            <span className={cn("text-[11px] font-bold tracking-tight transition-colors", isActive ? "glass-text" : "glass-text-muted")}>{s.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
