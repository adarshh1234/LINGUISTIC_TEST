"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Users,
  Search,
  Eye,
  Check,
  X,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { KpiCard } from "@/components/shared/kpi-card";
import { StatusPill } from "@/components/shared/status-pill";
import { integrityService } from "@/services/integrity.service";
import { IntegrityEvent, IntegritySummary } from "@/types/integrity.types";
import { formatDateTime } from "@/lib/utils";

export default function IntegrityMonitoringPage() {
  const [events, setEvents] = useState<IntegrityEvent[]>([]);
  const [summary, setSummary] = useState<IntegritySummary | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<IntegrityEvent | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const loadData = async () => {
    const [evList, sum] = await Promise.all([
      integrityService.getEvents(),
      integrityService.getSummary(),
    ]);
    setEvents(evList);
    setSummary(sum);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkReviewed = async () => {
    if (!selectedEvent) return;
    await integrityService.markEventReviewed(
      selectedEvent.id,
      reviewNotes || "Reviewed and validated by recruiter auditor.",
      "Sarah Jenkins (Senior Talent Lead)"
    );
    setSelectedEvent(null);
    setReviewNotes("");
    loadData();
  };

  const filtered = events.filter((e) => {
    const matchSearch =
      e.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      e.eventType.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "All" || e.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Assessment Integrity Console
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time proctoring telemetry, focus anomalies, and candidate verification signals.
        </p>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <KpiCard title="Total Events" value={summary.totalEvents} icon={ShieldAlert} />
          <KpiCard title="High Severity" value={summary.highSeverityCount} icon={AlertTriangle} badge="Requires Audit" />
          <KpiCard title="Medium Severity" value={summary.mediumSeverityCount} />
          <KpiCard title="Low Severity" value={summary.lowSeverityCount} />
          <KpiCard
            title="Candidates To Review"
            value={summary.candidatesRequiringReviewCount}
            subtitle="Recruiter verification"
            trend="neutral"
            icon={Users}
          />
        </div>
      )}

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Proctoring Policy Notice:</strong> Integrity signals are operational audit markers designed for recruiter evaluation. Candidates are never automatically disqualified by AI.
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Search by candidate name, event type, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
          >
            <option value="All">All Severities</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-6 font-medium">Candidate</th>
                  <th className="p-3.5 font-medium">Event Type</th>
                  <th className="p-3.5 font-medium">Module</th>
                  <th className="p-3.5 font-medium">Severity</th>
                  <th className="p-3.5 font-medium">Incident Details</th>
                  <th className="p-3.5 font-medium">Timestamp</th>
                  <th className="p-3.5 font-medium">Review Status</th>
                  <th className="p-3.5 pr-6 font-medium text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No integrity events found matching query.
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 pl-6">
                        <Link href={`/dashboard/candidates/${e.candidateId}`} className="font-semibold text-slate-900 hover:text-indigo-600 block">
                          {e.candidateName}
                        </Link>
                        <span className="text-[11px] text-slate-400">{e.assessmentName}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        {e.eventType.replace(/_/g, " ")}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                          {e.module}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            e.severity === "HIGH"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : e.severity === "MEDIUM"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {e.severity}
                        </span>
                      </td>
                      <td className="p-3.5 max-w-xs text-slate-600 leading-snug">
                        {e.details}
                      </td>
                      <td className="p-3.5 text-slate-400 whitespace-nowrap">
                        {formatDateTime(e.timestamp)}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        {e.isReviewed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Reviewed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            Pending Audit
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(e);
                            setReviewNotes(e.reviewNotes || "");
                          }}
                          className="h-7 text-xs"
                        >
                          {e.isReviewed ? "Inspect" : "Audit Signal"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogClose onClose={() => setSelectedEvent(null)} />
        {selectedEvent && (
          <div className="space-y-4 text-xs">
            <DialogHeader>
              <DialogTitle>Audit Integrity Event</DialogTitle>
              <DialogDescription>
                Review candidate proctoring event and document resolution notes.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <p><strong className="text-slate-900">Candidate:</strong> {selectedEvent.candidateName}</p>
              <p><strong className="text-slate-900">Event:</strong> {selectedEvent.eventType.replace(/_/g, " ")}</p>
              <p><strong className="text-slate-900">Module:</strong> {selectedEvent.module}</p>
              <p><strong className="text-slate-900">Severity:</strong> {selectedEvent.severity}</p>
              <p><strong className="text-slate-900">Details:</strong> {selectedEvent.details}</p>
              <p><strong className="text-slate-900">Detected:</strong> {formatDateTime(selectedEvent.timestamp)}</p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Recruiter Audit Notes & Resolution
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Validated candidate explanation; verified legitimate peripheral audio driver reset."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleMarkReviewed} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save & Mark Reviewed
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  );
}

