import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <ThemeToggle />
      <PomodoroTimer />
    </div>
  );
}
