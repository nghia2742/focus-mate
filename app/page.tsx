"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { GlassBackground } from "@/components/theme/glass-background";
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { SoundscapeSelector } from "@/components/sounds/sound-selector";
import { YoutubePlayer } from "@/components/sounds/youtube-player";
import { AIConsultant } from "@/components/ai/ai-consultant";
import { SettingsButton } from "@/components/settings/settings-button";

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <GlassBackground />
      <ThemeToggle />
      <SoundscapeSelector />
      <PomodoroTimer />
      <YoutubePlayer />
      <AIConsultant />
      <SettingsButton />
    </div>
  );
}
