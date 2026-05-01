"use client";

import { useState, useRef, useEffect } from "react";
import { CloudRain, Flame, Wind, Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type AmbientSound = "none" | "rain" | "fire" | "windy";

const SOUNDS: Record<AmbientSound, { name: string; file: string | null; icon: React.ReactNode }> = {
  none: { name: "None", file: null, icon: <VolumeX className="size-4" /> },
  rain: { name: "Rain", file: "/sounds/background-sounds/rain/rain_1.mp3", icon: <CloudRain className="size-4" /> },
  fire: { name: "Fire", file: "/sounds/background-sounds/fire/fire_1.mp3", icon: <Flame className="size-4" /> },
  windy: { name: "Windy", file: "/sounds/background-sounds/windy/windy_1.mp3", icon: <Wind className="size-4" /> },
};

export function SoundSelector() {
  const [activeSound, setActiveSound] = useState<AmbientSound>("none");
  const [volume, setVolume] = useState([50]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (activeSound === "none" || !SOUNDS[activeSound].file) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    audioRef.current.src = SOUNDS[activeSound].file as string;
    audioRef.current.volume = volume[0] / 100;
    audioRef.current.play().catch(console.error);
    
    return () => {
      // Don't stop on unmount if we want it to persist, but since it's mounted in v1 it stays.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="bg-white/20 backdrop-blur-md border-white/30 text-white rounded-full size-12">
          <Music className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-64 p-4 ml-4 glass backdrop-blur-xl border-white/20 bg-black/40 text-white">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Music className="size-4" />
          Ambient Sounds
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {(Object.keys(SOUNDS) as AmbientSound[]).map((key) => {
            const sound = SOUNDS[key];
            const isActive = activeSound === key;
            return (
              <Button
                key={key}
                variant={isActive ? "default" : "outline"}
                onClick={() => setActiveSound(key)}
                className={`flex gap-2 justify-start h-10 ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-white/10 hover:bg-white/20 border-white/10"
                }`}
              >
                {sound.icon}
                <span className="text-sm">{sound.name}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <Volume2 className="size-4" />
              Volume
            </span>
            <span className="text-xs text-white/70">{volume[0]}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={volume[0]}
            onChange={(e) => setVolume([parseInt(e.target.value)])}
            className="w-full accent-primary h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
