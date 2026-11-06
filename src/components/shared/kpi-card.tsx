import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  badge?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  change,
  trend = "neutral",
  icon: Icon,
  badge,
  className,
}: KpiCardProps) {
  return (
    <Card className={cn("p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
          {badge && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {badge}
            </span>
          )}
        </div>

        {(subtitle || change) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs">
            {change && (
              <span
                className={cn(
                  "font-medium",
                  trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-500"
                )}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {change}
              </span>
            )}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}

