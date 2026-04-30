"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeSetting() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-[52px] w-full inner-glass-bg animate-pulse rounded-xl" />;
    }

    const options = [
        { id: "light", icon: Sun, label: "Light" },
        { id: "dark", icon: Moon, label: "Dark" },
        { id: "system", icon: Monitor, label: "System" },
    ];

    return (
        <div className="flex gap-4 w-full">
            {options.map((opt) => {
                const Icon = opt.icon;
                const active = theme === opt.id;
                return (
                    <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-3 py-3 rounded-xl transition-all border",
                            active 
                                ? "bg-primary/10 border-primary text-primary shadow-lg" 
                                : "inner-glass-bg inner-glass-border text-glass-text-muted hover:inner-glass-bg-hover hover:glass-text"
                        )}
                    >
                        <Icon className="size-4" />
                        <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
