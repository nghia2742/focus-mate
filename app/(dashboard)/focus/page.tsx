"use client";

import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer";
import { YoutubePlayer } from "@/components/sounds/youtube-player";

export default function FocusPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10 animate-fade-in">
            <PomodoroTimer />
            <div className="max-w-md w-full">
                <YoutubePlayer />
            </div>
        </div>
    );
}
