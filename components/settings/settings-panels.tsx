"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/store/use-settings";
import {
    Clock,
    Play,
    RefreshCw,
    Settings2,
    Volume2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SettingsPanels() {
    const {
        focusMinutes, setFocusMinutes,
        shortBreakMinutes, setShortBreakMinutes,
        longBreakMinutes, setLongBreakMinutes,
        longBreakInterval, setLongBreakInterval,
        autoStartNext, setAutoStartNext,
        alarmSound, setAlarmSound,
    } = useSettings();

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
        <div className="w-full h-full flex flex-col overflow-hidden glass-heavy text-foreground">
            <DialogHeader className="p-8 pb-4">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3 glass-text">
                    <div className="p-2 rounded-xl bg-gray-500/10 border border-gray-500/20">
                        <Settings2 className="size-6 text-gray-400" />
                    </div>
                    Settings
                </DialogTitle>
            </DialogHeader>

            {/* Content Area */}
            <div className="flex-1 p-8 pt-4 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* Timer Settings */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Clock className="size-5 text-primary" />
                            <h3 className="text-lg font-bold glass-text">Timer Settings</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="focus-time" className="text-sm font-bold glass-text-muted">Focus Time (min)</Label>
                                <NumberInput
                                    id="focus-time"
                                    value={focusMinutes}
                                    onChange={setFocusMinutes}
                                    min={1}
                                    className="inner-glass-bg inner-glass-border glass-text h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="short-break" className="text-sm font-bold glass-text-muted">Short Break (min)</Label>
                                <NumberInput
                                    id="short-break"
                                    value={shortBreakMinutes}
                                    onChange={setShortBreakMinutes}
                                    min={1}
                                    className="inner-glass-bg inner-glass-border glass-text h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="long-break" className="text-sm font-bold glass-text-muted">Long Break (min)</Label>
                                <NumberInput
                                    id="long-break"
                                    value={longBreakMinutes}
                                    onChange={setLongBreakMinutes}
                                    min={1}
                                    className="inner-glass-bg inner-glass-border glass-text h-11"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="inner-glass-border opacity-50" />

                    {/* Session Options */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <RefreshCw className="size-5 text-primary" />
                            <h3 className="text-lg font-bold glass-text">Session Options</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-sm font-bold glass-text-muted">Auto Start Next Session</Label>
                                    <p className="text-xs glass-text-faint">Automatically starts the next timer when one finishes.</p>
                                </div>
                                <Switch
                                    checked={autoStartNext}
                                    onCheckedChange={setAutoStartNext}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="long-break-interval" className="text-sm font-bold glass-text-muted">Long Break Interval</Label>
                                    <p className="text-xs glass-text-faint">Sessions before a long break.</p>
                                </div>
                                <NumberInput
                                    id="long-break-interval"
                                    value={longBreakInterval}
                                    onChange={setLongBreakInterval}
                                    className="inner-glass-bg inner-glass-border glass-text h-11 w-48"
                                    min={1}
                                    max={10}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator className="inner-glass-border opacity-50" />

                    {/* Sound Settings */}
                    <div className="pb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Volume2 className="size-5 text-primary" />
                            <h3 className="text-lg font-bold glass-text">Sound Settings</h3>
                        </div>
                        <div className="flex items-center justify-between gap-8 flex-wrap">
                            <div className="space-y-1 shrink-0">
                                <Label className="text-sm font-bold glass-text-muted">Alarm Sound</Label>
                                <p className="text-xs glass-text-faint">Select the sound to play when a session ends.</p>
                            </div>
                            <div className="flex items-center gap-3 flex-1 max-w-md">
                                <Select value={alarmSound} onValueChange={setAlarmSound}>
                                    <SelectTrigger className="inner-glass-bg inner-glass-border glass-text h-12 rounded-lg text-sm px-4">
                                        <SelectValue placeholder="Select sound" />
                                    </SelectTrigger>
                                    <SelectContent className="glass-heavy inner-glass-border glass-text">
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
                                    className="size-12 inner-glass-bg inner-glass-border hover:inner-glass-bg-hover glass-text"
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
            </div>
        </div>
    );
}