"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AudioWaveform({
  isRecording = false,
  isPlaying = false,
  audioLevel = 0, // 0 to 100
  barCount = 28,
  className,
}: {
  isRecording?: boolean;
  isPlaying?: boolean;
  audioLevel?: number;
  barCount?: number;
  className?: string;
}) {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => Math.floor(Math.random() * 20) + 10)
  );

  useEffect(() => {
    if (!isRecording && !isPlaying) {
      setBars(Array.from({ length: barCount }, () => 12));
      return;
    }

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map(() => {
          if (isRecording) {
            const base = Math.max(15, audioLevel * 0.8);
            return Math.floor(Math.random() * base) + 12;
          }
          if (isPlaying) {
            return Math.floor(Math.random() * 50) + 15;
          }
          return 12;
        })
      );
    }, 90);

    return () => clearInterval(interval);
  }, [isRecording, isPlaying, audioLevel, barCount]);

  return (
    <div className={cn("flex items-center justify-center gap-1 h-14 px-4 bg-slate-900 rounded-xl overflow-hidden", className)}>
      {bars.map((height, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full transition-all duration-75",
            isRecording
              ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
              : isPlaying
              ? "bg-indigo-400"
              : "bg-slate-700"
          )}
          style={{ height: `${Math.min(50, height)}px` }}
        />
      ))}
    </div>
  );
}

