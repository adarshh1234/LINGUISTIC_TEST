"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  Users,
  BarChart3,
  ShieldAlert,
  Award,
  Palette,
  Settings,
  Sparkles,
  ArrowUpRight,
  Globe2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brandingService } from "@/services/branding.service";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { label: "Assessments", href: "/dashboard/assessments", icon: FileCheck2 },
  { label: "Candidates", href: "/dashboard/candidates", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Integrity Monitoring", href: "/dashboard/integrity", icon: ShieldAlert, badge: "3" },
  { label: "Certificate Verification", href: "/dashboard/certificates", icon: Award, badge: "2" },
  { label: "Branding", href: "/dashboard/branding", icon: Palette },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function RecruiterSidebar() {
  const pathname = usePathname();
  const branding = brandingService.getBranding();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-wide">
          V
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-900 text-sm truncate">
              {branding.organizationName || "Verbalis AI"}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
              SaaS
            </span>
          </div>
          <span className="text-[11px] text-slate-400 truncate">Linguistic Assessment</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Workspace
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                    isActive
                      ? "bg-indigo-200/70 text-indigo-800"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Candidate Portal Launcher Banner */}
      <div className="p-3 border-t border-slate-100">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 via-slate-50 to-slate-100 border border-indigo-100 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-950">
            <Globe2 className="w-4 h-4 text-indigo-600" />
            <span>Candidate Portal</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 leading-tight">
            Preview the candidate test taking experience.
          </p>
          <Link
            href="/candidate"
            target="_blank"
            className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 shadow-xs transition-colors"
          >
            <span>Open Candidate View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
          SJ
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-semibold text-slate-900 truncate">Sarah Jenkins</span>
          <span className="text-[11px] text-slate-400 truncate">Recruiter Admin</span>
        </div>
      </div>
    </aside>
  );
}

