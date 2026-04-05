"use client"

import React from "react"

import { Dock, DockIcon } from "@/components/ui/dock"
import { Home, Settings } from "lucide-react"
import { SettingsDialog } from "./settings-dialog"

export type IconProps = React.HTMLAttributes<SVGElement>

export function DockNav() {
    return (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <Dock iconMagnification={60} iconDistance={100}>
                <DockIcon className="bg-black/10 dark:bg-white/10" disableMagnification>
                    <Home className="size-full text-black dark:text-white" />
                </DockIcon>
                <DockIcon className="bg-black/10 dark:bg-white/10" disableMagnification>
                    <SettingsDialog>
                        <Settings className="size-full text-black dark:text-white" />
                    </SettingsDialog>
                </DockIcon>
            </Dock>
        </div>
    )
}