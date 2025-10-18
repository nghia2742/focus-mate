import React from "react";

interface PomodoroDisplayProps {
  timeLeft: number;
}

export function PomodoroDisplay({ timeLeft }: PomodoroDisplayProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="text-center">
      <div className="text-6xl font-bold tabular-nums">
        {pad(minutes)}:{pad(seconds)}
      </div>
    </div>
  );
}
