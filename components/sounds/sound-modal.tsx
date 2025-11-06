"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import useSound from "@/store/use-sound";
import { cn } from "@/lib/utils";

type AmbientKey = "rain" | "fire" | "windy";
const AMBIENTS: Record<AmbientKey, { label: string; src: string; icon: string }> = {
  rain: { label: "Rain", src: "/sounds/rain/rain_1.mp3", icon: "🌧️" },
  fire: { label: "Fire", src: "/sounds/fire/fire_1.mp3", icon: "🔥" },
  windy: { label: "Windy", src: "/sounds/windy/windy_1.mp3", icon: "💨" },
};

type MixerState = Record<AmbientKey, { enabled: boolean; volume: number }>;

export function SoundModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { type, isPlaying, handlePlay, handleClose } = useSound();
  const [mix, setMix] = useState<MixerState>({
    rain: { enabled: false, volume: 0.7 },
    fire: { enabled: false, volume: 0.6 },
    windy: { enabled: false, volume: 0.6 },
  });

  const audioRefs = useRef<Record<AmbientKey, HTMLAudioElement | null>>({
    rain: null,
    fire: null,
    windy: null,
  });

  // init audio elements
  useEffect(() => {
    (Object.keys(AMBIENTS) as AmbientKey[]).forEach((k) => {
      const a = new Audio(AMBIENTS[k].src);
      a.loop = true;
      a.volume = mix[k].volume;
      audioRefs.current[k] = a;
    });
    return () => {
      (Object.keys(audioRefs.current) as AmbientKey[]).forEach((k) => {
        audioRefs.current[k]?.pause();
        audioRefs.current[k] = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // react to enabled/volume/isPlaying
  useEffect(() => {
    (Object.keys(mix) as AmbientKey[]).forEach((k) => {
      const ref = audioRefs.current[k];
      if (!ref) return;
      if (type !== "soundscape") {
        ref.pause();
        return;
      }
      ref.volume = mix[k].volume;
      if (mix[k].enabled && isPlaying) {
        ref.play().catch(() => {});
      } else {
        ref.pause();
      }
    });
  }, [mix, isPlaying, type]);

  function toggleAmbient(k: AmbientKey) {
    setMix((m) => ({ ...m, [k]: { ...m[k], enabled: !m[k].enabled } }));
  }

  function setVolume(k: AmbientKey, v: number) {
    setMix((m) => ({ ...m, [k]: { ...m[k], volume: v } }));
  }

  const canControlAmbients = type === "soundscape";

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Ambient Soundscapes</div>
          <Button size="icon-sm" variant="ghost" onClick={() => onOpenChange(false)}>✕</Button>
        </div>

        {type === "youtube" && (
          <div className="mt-3 text-xs text-muted-foreground">
            YouTube sound is active. Close it to use ambient soundscapes.
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={handleClose}>Close YouTube</Button>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(Object.keys(AMBIENTS) as AmbientKey[]).map((k) => {
            const item = AMBIENTS[k];
            const active = mix[k].enabled && canControlAmbients;
            return (
              <div key={k} className={cn("rounded-xl border border-white/15 p-3 bg-white/5 backdrop-blur", !canControlAmbients && "opacity-50")}>
                <button
                  className={cn(
                    "w-full flex flex-col items-center gap-1 text-sm",
                    active ? "text-primary" : ""
                  )}
                  onClick={() => canControlAmbients && toggleAmbient(k)}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div>{item.label}</div>
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={mix[k].volume}
                  onChange={(e) => setVolume(k, Number(e.target.value))}
                  disabled={!canControlAmbients}
                  className="w-full mt-2"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setMix({ rain: { enabled: true, volume: 0.7 }, fire: { enabled: false, volume: 0.5 }, windy: { enabled: true, volume: 0.5 } })}>
              Rainy wind
            </Button>
            <Button size="sm" variant="outline" onClick={() => setMix({ rain: { enabled: false, volume: 0.5 }, fire: { enabled: true, volume: 0.6 }, windy: { enabled: false, volume: 0.5 } })}>
              Fireplace
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => handlePlay(true)} disabled={!canControlAmbients}>Play</Button>
            <Button size="sm" variant="secondary" onClick={() => handlePlay(false)} disabled={!canControlAmbients}>Pause</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}