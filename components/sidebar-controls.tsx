"use client"

import { Settings } from "lucide-react"
import { Button } from "./ui/button"
import { SoundSelector } from "./sounds/sound-selector"
import { SettingsDialog } from "./settings-dialog"

export function SidebarControls() {
    return (
        <div className="fixed top-28 left-4 z-40 pointer-events-auto flex flex-col gap-4">
            <div className="w-10 flex flex-col items-center gap-4">
                <SoundSelector />
                <SettingsDialog>
                    <Button size="icon" variant="outline" className="bg-white/20 backdrop-blur-md border-white/30 text-white rounded-full size-10 hover:bg-white/30 transition-all">
                        <Settings className="size-4" />
                    </Button>
                </SettingsDialog>
            </div>
        </div>
    )
}
