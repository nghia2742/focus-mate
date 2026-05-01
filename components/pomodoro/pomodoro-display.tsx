"use client";

import dynamic from "next/dynamic";

const FlipCountdown = dynamic(
  () => import("./flip-countdown").then((mod) => mod.FlipCountdown),
  { ssr: false }
);

export function PomodoroDisplay({ timeLeft }: { timeLeft: number }) {

  return <FlipCountdown timeLeft={timeLeft} />;
}
