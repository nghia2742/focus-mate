"use client";

import { useSettings } from "@/store/use-settings";
import { BackgroundSetting } from "./background-setting";
import { ThemeSetting } from "./theme-setting";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
    Timer, 
    Settings2, 
    Volume2, 
    Palette, 
    Play,
    RefreshCw,
    Sliders,
    Clock
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SettingsPanels() {
    const {
        focusMinutes, setFocusMinutes,
        shortBreakMinutes, setShortBreakMinutes,
        longBreakMinutes, setLongBreakMinutes,
        longBreakInterval, setLongBreakInterval,
        autoStartNext, setAutoStartNext,
        alarmSound, setAlarmSound,
    } = useSettings();

    const [activeTab, setActiveTab] = useState<"general" | "preference">("general");
    const [isTestingSound, setIsTestedSound] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => () => { 
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    }, []);

    const testSound = () => {
        if (isTestingSound) return;
        const audio = new Audio(`/sounds/alarm-sounds/${alarmSound}.mp3`);
        audioRef.current = audio;
        setIsTestedSound(true);
        audio.play().catch((err) => {
            console.error(err);
            setIsTestedSound(false);
        });
        audio.onended = () => {
            setIsTestedSound(false);
            audioRef.current = null;
        };
    };

    return (
        <div className="w-full h-full flex flex-row overflow-hidden bg-[#0a0a0a] text-white">
            {/* Internal Sidebar */}
            <div className="w-64 border-r border-white/10 bg-slate-400/10 flex flex-col p-4 pt-6 gap-2 shrink-0">
                <DialogHeader className="mb-6 px-2 text-left">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Settings2 className="size-5" />
                        Settings
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={cn(
                            "flex justify-start items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                            activeTab === 'general' 
                                ? 'bg-white/10 text-white shadow-sm' 
                                : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                        )}
                    >
                        <Sliders className="size-4" />
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab("preference")}
                        className={cn(
                            "flex justify-start items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                            activeTab === 'preference' 
                                ? 'bg-white/10 text-white shadow-sm' 
                                : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                        )}
                    >
                        <Palette className="size-4" />
                        Preferences
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-10 overflow-y-auto">
                {activeTab === "general" ? (
                    <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Timer Settings */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Clock className="size-5 text-primary" />
                                <h3 className="text-lg font-bold text-white">Timer Settings</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="focus-time" className="text-sm font-bold text-white/90">Focus Time (min)</Label>
                                    <Input
                                        id="focus-time"
                                        type="number"
                                        value={focusMinutes}
                                        onChange={(e) => setFocusMinutes(parseInt(e.target.value) || 0)}
                                        className="bg-white/5 border-white/10 h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="short-break" className="text-sm font-bold text-white/90">Short Break (min)</Label>
                                    <Input
                                        id="short-break"
                                        type="number"
                                        value={shortBreakMinutes}
                                        onChange={(e) => setShortBreakMinutes(parseInt(e.target.value) || 0)}
                                        className="bg-white/5 border-white/10 h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="long-break" className="text-sm font-bold text-white/90">Long Break (min)</Label>
                                    <Input
                                        id="long-break"
                                        type="number"
                                        value={longBreakMinutes}
                                        onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 0)}
                                        className="bg-white/5 border-white/10 h-11"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        {/* Session Options */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <RefreshCw className="size-5 text-primary" />
                                <h3 className="text-lg font-bold text-white">Session Options</h3>
                            </div>
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-bold text-white/90">Auto Start Next Session</Label>
                                        <p className="text-xs text-white/40">Automatically starts the next timer when one finishes.</p>
                                    </div>
                                    <Switch
                                        checked={autoStartNext}
                                        onCheckedChange={setAutoStartNext}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label htmlFor="long-break-interval" className="text-sm font-bold text-white/90">Long Break Interval</Label>
                                        <p className="text-xs text-white/40">Sessions before a long break.</p>
                                    </div>
                                    <Input
                                        id="long-break-interval"
                                        type="number"
                                        value={longBreakInterval}
                                        onChange={(e) => setLongBreakInterval(parseInt(e.target.value) || 1)}
                                        className="bg-white/5 border-white/10 w-24 text-center h-11"
                                        min={1}
                                        max={10}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/5" />

                        {/* Sound Settings */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Volume2 className="size-5 text-primary" />
                                <h3 className="text-lg font-bold text-white">Sound Settings</h3>
                            </div>
                            <div className="flex items-center justify-between gap-8">
                                <div className="space-y-1 shrink-0">
                                    <Label className="text-sm font-bold text-white/90">Alarm Sound</Label>
                                    <p className="text-xs text-white/40">Select the sound to play when a session ends.</p>
                                </div>
                                <div className="flex items-center gap-3 flex-1 max-w-md">
                                    <Select value={alarmSound} onValueChange={setAlarmSound}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-lg text-sm px-4">
                                            <SelectValue placeholder="Select sound" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
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
                                        className="size-12 bg-white/5 border-white/10 hover:bg-white/10"
                                        disabled={isTestingSound}
                                        onClick={testSound}
                                    >
                                        {isTestingSound ? (
                                            <Volume2 className="size-5 animate-pulse text-primary" />
                                        ) : (
                                            <Play className="size-5" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 pb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Palette className="size-5 text-primary" />
                                <h3 className="text-lg font-bold text-white">Preferences</h3>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <Label className="text-sm font-bold text-white/90 mb-4 block">Theme Preference</Label>
                                    <ThemeSetting />
                                </div>
                                <Separator className="bg-white/5" />
                                <div>
                                    <Label className="text-sm font-bold text-white/90 mb-4 block">Background Image</Label>
                                    <BackgroundSetting />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}