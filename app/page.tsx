import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { GlassBackground } from "@/components/theme/glass-background";

const PomodoroTimer = dynamic(() => import("@/components/pomodoro/pomodoro-timer").then(m => m.PomodoroTimer), { ssr: false });
const SoundscapeSelector = dynamic(() => import("@/components/sounds/sound-selector").then(m => m.SoundscapeSelector), { ssr: false });
const YoutubePlayer = dynamic(() => import("@/components/sounds/youtube-player").then(m => m.YoutubePlayer), { ssr: false });
const AIConsultant = dynamic(() => import("@/components/ai/ai-consultant").then(m => m.AIConsultant), { ssr: false });
const SettingsButton = dynamic(() => import("@/components/settings/settings-button").then(m => m.SettingsButton), { ssr: false });

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
