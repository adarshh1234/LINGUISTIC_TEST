"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileCheck2,
  ExternalLink,
  Users,
  Clock,
  Sparkles,
  Mic,
  BookOpen,
  PenTool,
  Shield,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { assessmentService } from "@/services/assessment.service";
import { candidateService } from "@/services/candidate.service";
import { Assessment } from "@/types/assessment.types";
import { Candidate } from "@/types/candidate.types";
import { formatDate } from "@/lib/utils";

export default function AssessmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const [a, allCands] = await Promise.all([
        assessmentService.getAssessmentById(id),
        candidateService.getCandidates(),
      ]);
      setAssessment(a);
      setCandidates(allCands.filter((c) => c.assessmentId === id));
    }
    loadData();
  }, [id]);

  if (!assessment) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/assessments" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessments
        </Link>
        <Card className="p-8 text-center text-slate-500 text-xs">Assessment record not found.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back Link */}
      <Link href="/dashboard/assessments" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessments Directory
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{assessment.name}</h1>
            <StatusPill status={assessment.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
            <Link href={`/dashboard/jobs/${assessment.jobId}`} className="font-medium text-indigo-600 hover:underline">
              {assessment.jobTitle}
            </Link>
            <span>•</span>
            <span>Created {formatDate(assessment.createdAt)}</span>
            <span>•</span>
            <span>{assessment.industry}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/candidate/assessment/${assessment.id}`} target="_blank">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-sm">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Candidate Assessment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Module Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold text-slate-900">Speaking Weight</span>
            </div>
            <span className="text-base font-bold text-slate-900">{assessment.weights.speakingWeight}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Mode: {assessment.speakingConfig.mode === "STRUCTURED_PROMPT" ? "Prompt & Record" : "Live AI Interview"} · Max {assessment.speakingConfig.recordingDurationSeconds}s
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-slate-900">Reading Weight</span>
            </div>
            <span className="text-base font-bold text-slate-900">{assessment.weights.readingWeight}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Target CEFR: {assessment.readingConfig.targetCEFR} · {assessment.readingConfig.durationMinutes} min limit
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-pink-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-pink-600" />
              <span className="text-xs font-semibold text-slate-900">Writing Weight</span>
            </div>
            <span className="text-base font-bold text-slate-900">{assessment.weights.writingWeight}%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Task: {assessment.writingConfig.taskType.replace(/_/g, " ")} · {assessment.writingConfig.minWordCount}–{assessment.writingConfig.maxWordCount} words
          </p>
        </Card>
      </div>

      {/* Assigned Candidates Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Assigned Candidates ({candidates.length})</CardTitle>
            <CardDescription>Candidates invited to complete this assessment</CardDescription>
          </div>
          <Link href="/dashboard/candidates" className="text-xs text-indigo-600 hover:underline">
            All candidates directory →
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="p-3.5 pl-6 font-medium">Candidate</th>
                  <th className="p-3.5 font-medium">Target CEFR</th>
                  <th className="p-3.5 font-medium">Achieved CEFR</th>
                  <th className="p-3.5 font-medium">Overall Score</th>
                  <th className="p-3.5 font-medium">Status</th>
                  <th className="p-3.5 pr-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No candidates assigned to this assessment.
                    </td>
                  </tr>
                ) : (
                  candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 pl-6">
                        <Link href={`/dashboard/candidates/${c.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 block">
                          {c.name}
                        </Link>
                        <span className="text-[11px] text-slate-400">{c.email}</span>
                      </td>
                      <td className="p-3.5">
                        <CefrBadge level={c.targetCEFR} />
                      </td>
                      <td className="p-3.5">
                        {c.achievedCEFR ? <CefrBadge level={c.achievedCEFR} /> : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {c.scorecard ? `${c.scorecard.overallScore}/100` : "—"}
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

