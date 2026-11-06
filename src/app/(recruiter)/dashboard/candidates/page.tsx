"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { WpmBadge } from "@/components/shared/wpm-badge";
import { candidateService } from "@/services/candidate.service";
import { Candidate, CandidateAssessmentStatus } from "@/types/candidate.types";
import { CEFRLevel } from "@/types/cefr.types";
import { exportToCsv } from "@/lib/utils";

export default function CandidatesListPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [cefrFilter, setCefrFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<"name" | "score" | "completedAt">("completedAt");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    async function loadData() {
      const list = await candidateService.getCandidates();
      setCandidates(list);
    }
    loadData();
  }, []);

  const handleExportCsv = () => {
    const exportRows = candidates.map((c) => ({
      "Candidate Name": c.name,
      Email: c.email,
      Job: c.jobTitle,
      Assessment: c.assessmentName,
      Language: c.assessedLanguage,
      "Target CEFR": c.targetCEFR,
      "Achieved CEFR": c.achievedCEFR || "N/A",
      "Overall Score": c.scorecard?.overallScore || "N/A",
      "Speaking Score": c.scorecard?.speakingScore || "N/A",
      "Reading Score": c.scorecard?.readingScore || "N/A",
      "Writing Score": c.scorecard?.writingScore || "N/A",
      WPM: c.scorecard?.speakingMetrics?.wordsPerMinute || "N/A",
      "Certificate Status": c.certificateStatus,
      "Integrity Status": c.integrityStatus,
      Status: c.status,
    }));
    exportToCsv("candidate_linguistic_evaluations", exportRows);
  };

  const filtered = candidates
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchCefr = cefrFilter === "All" || c.achievedCEFR === cefrFilter || c.targetCEFR === cefrFilter;
      return matchSearch && matchStatus && matchCefr;
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortField === "score") {
        const scoreA = a.scorecard?.overallScore || 0;
        const scoreB = b.scorecard?.overallScore || 0;
        return sortAsc ? scoreA - scoreB : scoreB - scoreA;
      }
      return sortAsc
        ? (a.completedAt || "").localeCompare(b.completedAt || "")
        : (b.completedAt || "").localeCompare(a.completedAt || "");
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidates Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Linguistic evaluation scorecards, CEFR benchmarks, WPM analytics, and proctoring logs.
          </p>
        </div>

        <Button onClick={handleExportCsv} variant="outline" size="sm" className="gap-1.5 text-xs text-slate-700">
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export to CSV</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Search candidates by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={cefrFilter}
            onChange={(e) => setCefrFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
          >
            <option value="All">All CEFR Levels</option>
            <option value="C2">C2 - Proficient</option>
            <option value="C1">C1 - Advanced</option>
            <option value="B2">B2 - Upper Intermediate</option>
            <option value="B1">B1 - Intermediate</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="UnderReview">Under Review</option>
            <option value="InProgress">In Progress</option>
            <option value="Disqualified">Disqualified</option>
          </select>

          <button
            onClick={() => {
              setSortField("score");
              setSortAsc(!sortAsc);
            }}
            className="flex items-center gap-1 text-xs border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>Sort by Score</span>
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-6 font-medium">Candidate</th>
                  <th className="p-3.5 font-medium">Job Position</th>
                  <th className="p-3.5 font-medium">Language</th>
                  <th className="p-3.5 font-medium">Target / Achieved CEFR</th>
                  <th className="p-3.5 font-medium">Module Breakdown (Spk / Rd / Wrt)</th>
                  <th className="p-3.5 font-medium">Overall Score</th>
                  <th className="p-3.5 font-medium">WPM Pacing</th>
                  <th className="p-3.5 font-medium">Integrity Risk</th>
                  <th className="p-3.5 font-medium">Status</th>
                  <th className="p-3.5 pr-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400">
                      No candidates match the filter parameters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-6">
                        <Link href={`/dashboard/candidates/${c.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 block">
                          {c.name}
                        </Link>
                        <span className="text-[11px] text-slate-400">{c.email}</span>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{c.jobTitle}</td>
                      <td className="p-3.5 text-slate-600">{c.assessedLanguage}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400">Target</span>
                          <CefrBadge level={c.targetCEFR} />
                          <span className="text-slate-300">→</span>
                          {c.achievedCEFR ? <CefrBadge level={c.achievedCEFR} /> : <span className="text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="p-3.5">
                        {c.scorecard ? (
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="text-indigo-600 font-semibold">{c.scorecard.speakingScore}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-purple-600 font-semibold">{c.scorecard.readingScore}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-pink-600 font-semibold">{c.scorecard.writingScore}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {c.scorecard ? (
                          <span className="text-sm">{c.scorecard.overallScore}/100</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {c.scorecard?.speakingMetrics?.wordsPerMinute ? (
                          <WpmBadge wpm={c.scorecard.speakingMetrics.wordsPerMinute} />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <StatusPill status={c.integrityStatus} />
                      </td>
                      <td className="p-3.5">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <Link href={`/dashboard/candidates/${c.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600">
                            Scorecard →
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

