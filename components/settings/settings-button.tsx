"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useSettings } from "@/store/use-settings";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed top-0 left-16 m-4 z-40">
        <Button size="icon" variant="outline" onClick={() => setOpen(true)} className="rounded-full bg-white/20 backdrop-blur-md border-white/30">
          <Settings className="size-4" />
        </Button>
      </div>
      <SettingsModal open={open} onOpenChange={setOpen} />
    </>
  );
}

function SettingsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const {
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    autoStartNext,
    setFocusMinutes,
    setShortBreakMinutes,
    setLongBreakMinutes,
    setAutoStartNext,
  } = useSettings();

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Settings</div>
          <Button size="icon-sm" variant="ghost" onClick={() => onOpenChange(false)}>✕</Button>
        </div>
        <div className="mt-3 space-y-4">
          <Section title="Pomodoro length (minutes)">
            <NumberField value={focusMinutes} onChange={setFocusMinutes} min={1} max={120} />
          </Section>
          <Section title="Short break (minutes)">
            <NumberField value={shortBreakMinutes} onChange={setShortBreakMinutes} min={1} max={60} />
          </Section>
          <Section title="Long break (minutes)">
            <NumberField value={longBreakMinutes} onChange={setLongBreakMinutes} min={1} max={120} />
          </Section>
          <Section title="Auto-start next session">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={autoStartNext} onChange={(e) => setAutoStartNext(e.target.checked)} className="size-4 accent-current" />
              <span className="text-sm">Enable</span>
            </label>
          </Section>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs mb-1 text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function NumberField({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 rounded-md bg-white/10 border border-white/20 px-2 py-1 text-sm"
      />
    </div>
  );
}