"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "@/store/use-settings"
import { Palette, Play, RefreshCw, Settings2, Timer, Volume2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { BackgroundSettingClient } from "./settings/background-setting-client"
import { ThemeSetting } from "./settings/theme-setting"

export function SettingsDialog({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState("general")
    const {
        focusMinutes, setFocusMinutes,
        shortBreakMinutes, setShortBreakMinutes,
        longBreakMinutes, setLongBreakMinutes,
        longBreakInterval, setLongBreakInterval,
        autoStartNext, setAutoStartNext,
        alarmSound, setAlarmSound
    } = useSettings()

    const [isTestingSound, setIsTestedSound] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0 overflow-hidden glass backdrop-blur-md flex flex-row h-[600px] max-h-[85vh] gap-0">
                {/* Internal Sidebar */}
                <div className="w-64 border-r border-white/10 bg-slate-400/10 flex flex-col p-4 gap-2">
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
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-left flex flex-col gap-8 h-full">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Timer className="size-4 text-primary" />
                                    <h3 className="text-lg font-medium">Timer Settings</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="focus-time">Focus Time (min)</Label>
                                        <Input
                                            id="focus-time"
                                            type="number"
                                            value={focusMinutes}
                                            onChange={(e) => setFocusMinutes(parseInt(e.target.value) || 0)}
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="short-break">Short Break (min)</Label>
                                        <Input
                                            id="short-break"
                                            type="number"
                                            value={shortBreakMinutes}
                                            onChange={(e) => setShortBreakMinutes(parseInt(e.target.value) || 0)}
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="long-break">Long Break (min)</Label>
                                        <Input
                                            id="long-break"
                                            type="number"
                                            value={longBreakMinutes}
                                            onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 0)}
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-white/10" />

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <RefreshCw className="size-4 text-primary" />
                                    <h3 className="text-lg font-medium">Session Options</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Auto Start Next Session</Label>
                                            <p className="text-sm text-foreground/60">Automatically starts the next timer when one finishes.</p>
                                        </div>
                                        <Switch
                                            checked={autoStartNext}
                                            onCheckedChange={setAutoStartNext}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="long-break-interval">Long Break Interval</Label>
                                            <p className="text-sm text-foreground/60">Sessions before a long break.</p>
                                        </div>
                                        <Input
                                            id="long-break-interval"
                                            type="number"
                                            value={longBreakInterval}
                                            onChange={(e) => setLongBreakInterval(parseInt(e.target.value) || 1)}
                                            className="bg-white/5 border-white/10 w-24"
                                            min={1}
                                            max={10}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-white/10" />

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Volume2 className="size-4 text-primary" />
                                    <h3 className="text-lg font-medium">Sound Settings</h3>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <Label>Alarm Sound</Label>
                                        <p className="text-sm text-foreground/60">Select the sound to play when a session ends.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select value={alarmSound} onValueChange={setAlarmSound}>
                                            <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
                                                <SelectValue placeholder="Select sound" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="alarm-clock-short">Alarm Clock</SelectItem>
                                                <SelectItem value="bedside-clock-alarm">Bedside Clock</SelectItem>
                                                <SelectItem value="bell">Classic Bell</SelectItem>
                                                <SelectItem value="cow-bell">Cow Bell</SelectItem>
                                                <SelectItem value="school-bell">School Bell</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-white/5 border-white/10 hover:bg-white/10"
                                            disabled={isTestingSound}
                                            onClick={() => {
                                                if (isTestingSound) return

                                                const audio = new Audio(`/sounds/alarm-sounds/${alarmSound}.mp3`)
                                                audioRef.current = audio
                                                setIsTestedSound(true)

                                                audio.play().catch((err) => {
                                                    console.error(err)
                                                    setIsTestedSound(false)
                                                })

                                                audio.onended = () => {
                                                    setIsTestedSound(false)
                                                    audioRef.current = null
                                                }
                                            }}
                                            title={isTestingSound ? "Playing..." : "Test sound"}
                                        >
                                            {isTestingSound ? (
                                                <Volume2 className="size-4 animate-pulse text-primary" />
                                            ) : (
                                                <Play className="size-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "preferences" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                            <h3 className="text-lg font-medium mb-4">Preferences</h3>
                            <ThemeSetting />
                            <BackgroundSettingClient />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
