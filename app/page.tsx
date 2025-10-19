import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { SoundscapeSelector } from "@/components/sounds/sound-selector";
import { YoutubePlayer } from "@/components/sounds/youtube-player";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <ThemeToggle />
      <SoundscapeSelector />
      <PomodoroTimer />

      <YoutubePlayer />
    </div>
  );
}
