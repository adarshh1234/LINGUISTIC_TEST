"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function RecruiterHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg w-64 md:w-80 transition-all text-left"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="flex-1 truncate">Search candidates, assessments, jobs...</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Architecture Notice Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-700">Standalone SaaS Mock Layer</span>
          <span className="text-[11px] text-slate-400">· Ready for LetGetIn</span>
        </div>

        {/* Candidate Portal Launcher */}
        <Link href="/candidate" target="_blank">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-700">
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Preview</span> Candidate Portal
          </Button>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg p-3 text-xs z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-900">Notifications</span>
                <span className="text-[11px] text-indigo-600 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-1">
                <div className="py-2 hover:bg-slate-50 px-1 rounded cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">New Scorecard Ready</span>
                    <span className="text-[10px] text-slate-400">12m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Elena Rostova completed C1 assessment with score 89/100.
                  </p>
                </div>
                <div className="py-2 hover:bg-slate-50 px-1 rounded cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-amber-700">Integrity Alert</span>
                    <span className="text-[10px] text-slate-400">1h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ananya Patel: Clipboard paste event intercepted.
                  </p>
                </div>
                <div className="py-2 hover:bg-slate-50 px-1 rounded cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">Certificate Uploaded</span>
                    <span className="text-[10px] text-slate-400">2h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Carlos Mendez uploaded DELE B2 certificate for audit.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Dialog */}
      <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by candidate name, job title, CEFR level, or assessment..."
              className="w-full text-sm outline-none placeholder:text-slate-400 text-slate-900"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Suggestions
            </span>
            <div className="space-y-1">
              <Link
                href="/dashboard/candidates/cand-001"
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <span className="font-medium text-slate-800">Elena Rostova</span>
                  <span className="text-slate-400 ml-2">C1 Achieved · Score 89</span>
                </div>
                <span className="text-[11px] text-indigo-600">View Scorecard →</span>
              </Link>
              <Link
                href="/dashboard/assessments/asm-001"
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <span className="font-medium text-slate-800">Enterprise Customer Success C1</span>
                  <span className="text-slate-400 ml-2">45 Candidates Invited</span>
                </div>
                <span className="text-[11px] text-indigo-600">Open Assessment →</span>
              </Link>
              <Link
                href="/dashboard/integrity"
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <div>
                  <span className="font-medium text-amber-700">Integrity Events Table</span>
                  <span className="text-slate-400 ml-2">7 Detected Incidents</span>
                </div>
                <span className="text-[11px] text-indigo-600">Review Signals →</span>
              </Link>
            </div>
          </div>
        </div>
      </Dialog>
    </header>
  );
}

