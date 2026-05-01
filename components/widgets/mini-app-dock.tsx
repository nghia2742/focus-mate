"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MacOSDock, type DockApp } from "@/components/ui/mac-os-dock";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SettingsPanels } from "../settings/settings-panels";
import { GoalWidget } from "./goal-widget";
import { MusicWidget } from "./music-widget";
import { NotesWidget } from "./notes-widget";
import { PhotosWidget } from "./photos-widget";
import { TodoWidget } from "./todo-widget";

const DOCK_APPS: DockApp[] = [
    { id: "tasks", name: "Tasks", icon: "https://cdn.jim-nielsen.com/macos/512/meistertask-task-management-2017-03-10.png?rf=1024", tooltip: "Manage your daily focus tasks" },
    { id: "notes", name: "Notes", icon: "https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024", tooltip: "Quick scratchpad for your ideas" },
    { id: "music", name: "Music", icon: "https://cdn.jim-nielsen.com/macos/512/music-2025-11-13.png?rf=1024", tooltip: "Ambient sounds for deep work" },
    { id: "goal", name: "Goal", icon: "https://cdn.jim-nielsen.com/macos/512/rocketsim-for-xcode-simulator-2025-11-17.png?rf=1024", tooltip: "Track your daily focus progress" },
    { id: "photos", name: "Photos", icon: "https://cdn.jim-nielsen.com/macos/1024/photos-2025-11-14.png?rf=1024", tooltip: "Change your background image" },
    { id: "settings", name: "Settings", icon: "https://cdn.jim-nielsen.com/macos/512/system-settings-2025-11-14.png?rf=1024", tooltip: "Customize your focus experience" },
];

export function MiniAppDock({ className }: { className?: string }) {
    const [openApp, setOpenApp] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const notReadyToUse = ["notes", "goal"]

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    const renderContent = () => {
        switch (openApp) {
            case "tasks": return <TodoWidget />;
            case "notes": return <NotesWidget />;
            case "music": return <MusicWidget />;
            case "goal": return <GoalWidget />;
            case "photos": return <PhotosWidget />;
            case "settings": return <SettingsPanels />;
            default: return null;
        }
    };

    const getDialogWidth = () => {
        switch (openApp) {
            case "tasks": return "sm:max-w-lg h-[620px]";
            case "notes": return "sm:max-w-xl h-[560px]";
            case "music": return "sm:max-w-md h-[520px]";
            case "goal": return "sm:max-w-sm h-[540px]";
            case "photos": return "sm:max-w-3xl h-[620px]";
            case "settings": return "sm:max-w-2xl h-[720px]";
            default: return "sm:max-w-md";
        }
    };

    return (
        <>
            <MacOSDock
                apps={DOCK_APPS}
                onAppClick={(id) => notReadyToUse.includes(id) ? toast.info(`${DOCK_APPS.find(x => x.id === id)?.name} is not ready yet. Check back soon!`) : setOpenApp(prev => prev === id ? null : id)}
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
