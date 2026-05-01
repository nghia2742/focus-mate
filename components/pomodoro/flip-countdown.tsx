"use client";

import Tick, { type TickInstance } from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import { useEffect, useRef } from "react";

interface FlipCountdownProps {
  timeLeft: number;
}

export const FlipCountdown = ({ timeLeft }: FlipCountdownProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<TickInstance | null>(null);

  useEffect(() => {
    const didInit = (tick: TickInstance) => {
      tickRef.current = tick;
    };

    const currDiv = divRef.current;
    if (!currDiv) return;

    // Create the Tick instance
    const instance = Tick.DOM.create(currDiv, {
      value: timeLeft,
      didInit,
    });

    return () => {
      if (instance) {
        Tick.DOM.destroy(instance);
      }
    };
  }, []); // Only initialize once

  useEffect(() => {
    if (tickRef.current) {
      // Format timeLeft (seconds) into HH:MM:SS or MM:SS
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;

      const format = (n: number) => n.toString().padStart(2, "0");

      let displayValue;
      if (hours > 0) {
        displayValue = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
      } else {
        displayValue = `${format(minutes)}:${format(seconds)}`;
      }

      tickRef.current.value = displayValue;
    }
  }, [timeLeft]);

  return (
    <div ref={divRef} className="tick text-7xl [&_a]:hidden">
      <div data-repeat="true">
        <span data-view="flip" />
      </div>
    </div>
  );
};
