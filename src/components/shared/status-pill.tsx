import React from "react";
import { cn } from "@/lib/utils";

type StatusType =
  | "Active"
  | "Published"
  | "Draft"
  | "Completed"
  | "Archived"
  | "Invited"
  | "InProgress"
  | "UnderReview"
  | "Disqualified"
  | "Clean"
  | "Low"
  | "Medium"
  | "High"
  | "Verified"
  | "Pending"
  | "Pending Manual Audit"
  | "Failed"
  | "None";

export function StatusPill({
  status,
  className,
}: {
  status: StatusType | string;
  className?: string;
}) {
  let style = "bg-slate-100 text-slate-700 border-slate-200";
  let dotColor = "bg-slate-400";

  switch (status) {
    case "Active":
    case "Published":
    case "Completed":
    case "Verified":
    case "Clean":
      style = "bg-emerald-50 text-emerald-700 border-emerald-200";
      dotColor = "bg-emerald-500";
      break;
    case "InProgress":
    case "Pending":
    case "Low":
      style = "bg-blue-50 text-blue-700 border-blue-200";
      dotColor = "bg-blue-500";
      break;
    case "UnderReview":
    case "Pending Manual Audit":
    case "Medium":
      style = "bg-amber-50 text-amber-700 border-amber-200";
      dotColor = "bg-amber-500";
      break;
    case "Disqualified":
    case "Failed":
    case "High":
      style = "bg-rose-50 text-rose-700 border-rose-200";
      dotColor = "bg-rose-500";
      break;
    case "Draft":
    case "Archived":
    case "Invited":
    case "None":
    default:
      style = "bg-slate-100 text-slate-700 border-slate-200";
      dotColor = "bg-slate-400";
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        style,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
      <span>{status}</span>
    </span>
  );
}

