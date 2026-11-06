"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Search,
  Plus,
  Copy,
  Archive,
  ExternalLink,
  ChevronRight,
  Filter,
  Users,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { assessmentService } from "@/services/assessment.service";
import { Assessment, AssessmentStatus } from "@/types/assessment.types";
import { formatDate } from "@/lib/utils";

export default function AssessmentsListPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    const list = await assessmentService.getAssessments();
    setAssessments(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDuplicate = async (id: string, name: string) => {
    await assessmentService.duplicateAssessment(id);
    setActionMessage(`Created duplicate copy of "${name}"`);
    setTimeout(() => setActionMessage(null), 3000);
    loadData();
  };

  const handleArchive = async (id: string, name: string) => {
    await assessmentService.archiveAssessment(id);
    setActionMessage(`Archived "${name}"`);
    setTimeout(() => setActionMessage(null), 3000);
    loadData();
  };

  const handlePublish = async (id: string, name: string) => {
    await assessmentService.publishAssessment(id);
    setActionMessage(`Published "${name}"`);
    setTimeout(() => setActionMessage(null), 3000);
    loadData();
  };

  const filtered = assessments.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Linguistic Assessments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure, deploy, and audit CEFR language proficiency tests across candidate pipelines.
          </p>
        </div>

        <Link href="/dashboard/assessments/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Assessment</span>
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Search assessments by title or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-6 font-medium">Assessment Name</th>
                  <th className="p-3.5 font-medium">Mapped Job</th>
                  <th className="p-3.5 font-medium">Languages & CEFR</th>
                  <th className="p-3.5 font-medium">Enabled Modules & Weights</th>
                  <th className="p-3.5 font-medium">Completion Rate</th>
                  <th className="p-3.5 font-medium">Status</th>
                  <th className="p-3.5 pr-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No assessments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-6">
                        <Link href={`/dashboard/assessments/${a.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 block">
                          {a.name}
                        </Link>
                        <span className="text-[11px] text-slate-400">Created {formatDate(a.createdAt)}</span>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">
                        <Link href={`/dashboard/jobs/${a.jobId}`} className="hover:underline text-slate-700">
                          {a.jobTitle}
                        </Link>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {a.languages.map((l, i) => (
                            <div key={i} className="flex items-center gap-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                              <span className="font-medium text-slate-800">{l.language}</span>
                              <CefrBadge level={l.targetCEFR} />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          {a.speakingConfig.enabled && (
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-100">
                              Spk {a.weights.speakingWeight}%
                            </span>
                          )}
                          {a.readingConfig.enabled && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium border border-purple-100">
                              Rd {a.weights.readingWeight}%
                            </span>
                          )}
                          {a.writingConfig.enabled && (
                            <span className="px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 font-medium border border-pink-100">
                              Wrt {a.weights.writingWeight}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-900">{a.candidatesCompletedCount}</span>
                          <span className="text-slate-400">/ {a.candidatesInvitedCount}</span>
                          {a.candidatesInvitedCount > 0 && (
                            <span className="text-[10px] text-emerald-600 font-medium ml-1">
                              ({Math.round((a.candidatesCompletedCount / a.candidatesInvitedCount) * 100)}%)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <StatusPill status={a.status} />
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/dashboard/assessments/${a.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600">
                              View
                            </Button>
                          </Link>

                          {a.status === "Draft" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
                              onClick={() => handlePublish(a.id, a.name)}
                            >
                              Publish
                            </Button>
                          )}

                          <button
                            onClick={() => handleDuplicate(a.id, a.name)}
                            title="Duplicate Assessment"
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {a.status !== "Archived" && (
                            <button
                              onClick={() => handleArchive(a.id, a.name)}
                              title="Archive Assessment"
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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

