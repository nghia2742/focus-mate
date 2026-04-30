"use client"

import React from "react"
import { SoundSelector } from "./sounds/sound-selector"
import { SettingsDialog } from "./settings-dialog"
import { Settings } from "lucide-react"
import { Button } from "./ui/button"

export function SidebarControls() {
    return (
        <div className="fixed top-28 left-4 z-40 pointer-events-auto flex flex-col gap-4">
            <SoundSelector />
            <SettingsDialog>
                <Button size="icon" variant="outline" className="bg-white/20 backdrop-blur-md border-white/30 text-white rounded-full size-12">
                    <Settings className="size-5" />
                </Button>
            </SettingsDialog>
        </div>
    )
}
