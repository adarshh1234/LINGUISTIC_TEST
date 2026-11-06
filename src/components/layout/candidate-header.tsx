"use client";

import React from "react";
import Link from "next/link";
import { Mic, Wifi, Shield, HelpCircle } from "lucide-react";
import { brandingService } from "@/services/branding.service";

interface CandidateHeaderProps {
  currentStepTitle?: string;
  stepNumber?: number;
  totalSteps?: number;
  timeRemainingSeconds?: number;
  showTimer?: boolean;
}

export function CandidateHeader({
  currentStepTitle,
  stepNumber,
  totalSteps = 10,
  timeRemainingSeconds,
  showTimer = false,
}: CandidateHeaderProps) {
  const branding = brandingService.getBranding();

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Organization Branding */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs tracking-wider">
          {branding.organizationName.charAt(0)}
        </div>
        <div>
          <span className="font-semibold text-xs sm:text-sm text-slate-900 block leading-tight">
            {branding.organizationName}
          </span>
          <span className="text-[10px] text-slate-500">Linguistic Assessment</span>
        </div>
      </div>

      {/* Center: Step Progress or Active Module */}
      {currentStepTitle && (
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-2">
            {stepNumber && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Step {stepNumber} of {totalSteps}
              </span>
            )}
            <span className="text-xs font-semibold text-slate-800">{currentStepTitle}</span>
          </div>
          {stepNumber && (
            <div className="w-48 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Right: Timer & Health Indicators */}
      <div className="flex items-center gap-3">
        {showTimer && timeRemainingSeconds !== undefined && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
              timeRemainingSeconds < 120
                ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <span>Time Left:</span>
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-slate-500">
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100" title="Audio Device Active">
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mic Ready</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-600 px-2 py-1 rounded-md bg-slate-50 border border-slate-200" title="Connection Stable">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}

