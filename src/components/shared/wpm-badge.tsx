import React from "react";
import { getWpmClassification } from "@/types/cefr.types";
import { cn } from "@/lib/utils";
import { Gauge } from "lucide-react";

export function WpmBadge({
  wpm,
  showIcon = true,
  className,
}: {
  wpm: number;
  showIcon?: boolean;
  className?: string;
}) {
  const { label, color, classification } = getWpmClassification(wpm);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border",
        color,
        className
      )}
      title={`Words Per Minute: ${wpm} (${classification})`}
    >
      {showIcon && <Gauge className="w-3 h-3 opacity-75" />}
      <span className="font-semibold">{wpm} WPM</span>
      <span className="text-[10px] opacity-80 font-normal">
        {classification === "MODERATE" ? "Moderate" : classification === "SLOW_OR_HESITANT" ? "Hesitant" : "Fast"}
      </span>
    </div>
  );
}

