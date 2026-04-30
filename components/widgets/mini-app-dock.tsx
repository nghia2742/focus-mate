"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MacOSDock, type DockApp } from "@/components/ui/mac-os-dock";
import { SettingsPanels } from "../settings/settings-panels";
import { TodoWidget } from "./todo-widget";
import { NotesWidget } from "./notes-widget";
import { MusicWidget } from "./music-widget";
import { GoalWidget } from "./goal-widget";

const DOCK_APPS: DockApp[] = [
    { id: "tasks", name: "Tasks", icon: "https://cdn.jim-nielsen.com/macos/512/meistertask-task-management-2017-03-10.png?rf=1024" },
    { id: "notes", name: "Notes", icon: "https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024" },
    { id: "music", name: "Music", icon: "https://cdn.jim-nielsen.com/macos/512/music-2025-11-13.png?rf=1024" },
    { id: "goal", name: "Goal", icon: "https://cdn.jim-nielsen.com/macos/512/rocketsim-for-xcode-simulator-2025-11-17.png?rf=1024" },
    { id: "settings", name: "Settings", icon: "https://cdn.jim-nielsen.com/macos/512/system-settings-2025-11-14.png?rf=1024" },
];

export function MiniAppDock({ className }: { className?: string }) {
    const [openApp, setOpenApp] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    const renderContent = () => {
        switch (openApp) {
            case "tasks": return <TodoWidget />;
            case "notes": return <NotesWidget />;
            case "music": return <MusicWidget />;
            case "goal": return <GoalWidget />;
            case "settings": return <SettingsPanels />;
            default: return null;
        }
    };

    const getDialogWidth = () => {
        switch (openApp) {
            case "tasks": return "sm:max-w-lg h-[620px]";
            case "notes": return "sm:max-w-xl h-[560px]";
            case "music": return "sm:max-w-md h-[580px]";
            case "goal": return "sm:max-w-sm h-[540px]";
            case "settings": return "sm:max-w-[1100px] h-[720px]";
            default: return "sm:max-w-md";
        }
    };

    return (
        <>
            <MacOSDock
                apps={DOCK_APPS}
                onAppClick={(id) => setOpenApp(prev => prev === id ? null : id)}
                openApps={openApp ? [openApp] : []}
                className={className}
            />

            <Dialog open={!!openApp} onOpenChange={(open) => !open && setOpenApp(null)}>
                <DialogContent className={cn(
                    "p-0 overflow-hidden glass-heavy backdrop-blur-3xl animate-in zoom-in-95 duration-200 border-none",
                    getDialogWidth(),
                    openApp === 'settings' && "border-none"
                )}>
                    {renderContent()}
                </DialogContent>
            </Dialog>
        </>
    );
}
