"use client";

export const dynamic = "force-dynamic";

import { AIConsultant } from "@/components/ai/ai-consultant";
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { SettingsButton } from "@/components/settings/settings-button";
import { YoutubePlayer } from "@/components/sounds/youtube-player";
import { GlassBackground } from "@/components/theme/glass-background";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
    return (
        <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center gap-8 p-8">
            <GlassBackground />
            <ThemeToggle />
            <PomodoroTimer />
            <YoutubePlayer />
            <AIConsultant />
            <SettingsButton />
        </div>
    );
}
