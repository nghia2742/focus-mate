import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <PomodoroTimer />
    </div>
  );
}
