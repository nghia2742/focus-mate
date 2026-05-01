"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  label?: string;
  className?: string;
}

export function Counter({
  value,
  onChange,
  min = 1,
  max = 120,
  step = 1,
  unit,
  label,
  className,
}: CounterProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 p-3 rounded-xl glass-subtle", className)}>
      <div className="flex flex-col">
        {label && <span className="text-xs font-medium glass-text-faint uppercase tracking-wider">{label}</span>}
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold glass-text font-mono">{value}</span>
          {unit && <span className="text-xs glass-text-muted">{unit}</span>}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
          className="size-9 rounded-lg glass hover-glass glass-text flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <Minus className="size-4" />
        </button>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
          className="size-9 rounded-lg glass hover-glass glass-text flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
