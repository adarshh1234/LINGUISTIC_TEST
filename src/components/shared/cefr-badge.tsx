import React from "react";
import { CEFRLevel, CEFR_LEVELS_INFO } from "@/types/cefr.types";
import { cn } from "@/lib/utils";

export function CefrBadge({
  level,
  showLabel = false,
  className,
}: {
  level?: CEFRLevel;
  showLabel?: boolean;
  className?: string;
}) {
  if (!level || !CEFR_LEVELS_INFO[level]) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        N/A
      </span>
    );
  }

  const info = CEFR_LEVELS_INFO[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border shadow-xs tracking-tight",
        info.badgeColor,
        className
      )}
      title={`${info.level}: ${info.name} (${info.minScore}-${info.maxScore}%)`}
    >
      <span>{info.level}</span>
      {showLabel && <span className="opacity-80 font-normal">· {info.name}</span>}
    </span>
  );
}

