import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { MiniAppDock } from "@/components/widgets";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      {/* Timer — full attention, no competing widgets */}
      <div className="flex items-center justify-center">
        <PomodoroTimer />
      </div>

      {/* Mini-app dock — sits at the bottom like macOS dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <MiniAppDock />
      </div>
    </div>
  );
}
