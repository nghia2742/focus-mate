"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { Settings, Settings2, Palette } from "lucide-react"

export function SettingsDialog({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState("preferences")

    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton className="hover-glass">
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden glass backdrop-blur-md flex flex-row h-[600px] max-h-[85vh] gap-0">
                {/* Internal Sidebar */}
                <div className="w-64 border-r border-white/10 bg-slate-400/20 flex flex-col p-4 gap-2">
                    <DialogHeader className="mb-4 text-left">
                        <DialogTitle className="text-xl">Settings</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-1">
                        <button 
                            onClick={() => setActiveTab("general")}
                            className={`flex justify-start items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${activeTab === 'general' ? 'bg-primary/20 text-primary font-medium shadow-sm' : 'hover:bg-primary/10'}`}
                        >
                            <Settings2 className="size-4" />
                            General
                        </button>
                        <button 
                            onClick={() => setActiveTab("preferences")}
                            className={`flex justify-start items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${activeTab === 'preferences' ? 'bg-primary/20 text-primary font-medium shadow-sm' : 'hover:bg-primary/10'}`}
                        >
                            <Palette className="size-4" />
                            Preferences
                        </button>
                    </div>
                </div>
                
                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto w-full">
                    {activeTab === "general" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                            <h3 className="text-lg font-medium mb-4">General Settings</h3>
                            <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-dashed border-white/20 bg-black/5">
                                <p className="text-sm text-foreground/60">General settings coming soon...</p>
                            </div>
                        </div>
                    )}
                    {activeTab === "preferences" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                            <h3 className="text-lg font-medium mb-4">Preferences</h3>
                            {children}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

