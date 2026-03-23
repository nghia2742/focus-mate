"use client"

import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSetting() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="space-y-4 py-4 border-t border-border mt-2 h-[130px]"></div>
    }

    return (
        <div className="space-y-3 pb-4 mb-2 border-b border-border">
            <h4 className="text-sm font-medium">Theme Preference</h4>
            <div className="flex gap-2">
                <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 border transition-all rounded-md ${
                        theme === "light" 
                        ? "border-primary bg-primary/10 shadow-sm" 
                        : "border-transparent bg-secondary hover:bg-secondary/80 active:scale-95"
                    }`}
                >
                    <Sun className="h-4 w-4" />
                    <span className="text-xs font-medium">Light</span>
                </button>
                <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 border transition-all rounded-md ${
                        theme === "dark" 
                        ? "border-primary bg-primary/10 shadow-sm" 
                        : "border-transparent bg-secondary hover:bg-secondary/80 active:scale-95"
                    }`}
                >
                    <Moon className="h-4 w-4" />
                    <span className="text-xs font-medium">Dark</span>
                </button>
                <button
                    onClick={() => setTheme("system")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 border transition-all rounded-md ${
                        theme === "system" 
                        ? "border-primary bg-primary/10 shadow-sm" 
                        : "border-transparent bg-secondary hover:bg-secondary/80 active:scale-95"
                    }`}
                >
                    <Monitor className="h-4 w-4" />
                    <span className="text-xs font-medium">System</span>
                </button>
            </div>
        </div>
    )
}
