"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Users,
  FileCheck2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { jobService } from "@/services/job.service";
import { candidateService } from "@/services/candidate.service";
import { assessmentService } from "@/services/assessment.service";
import { Job } from "@/types/job.types";
import { Candidate } from "@/types/candidate.types";
import { Assessment } from "@/types/assessment.types";

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const [j, allCands, allAssess] = await Promise.all([
        jobService.getJobById(id),
        candidateService.getCandidates(),
        assessmentService.getAssessments(),
      ]);
      setJob(j);
      setCandidates(allCands.filter((c) => c.jobId === id));
      setAssessments(allAssess.filter((a) => a.jobId === id));
    }
    loadData();
  }, [id]);

  if (!job) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/jobs" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Jobs
        </Link>
        <Card className="p-8 text-center text-slate-500 text-xs">Job not found.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back Link */}
      <Link href="/dashboard/jobs" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Jobs Directory
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{job.title}</h1>
            <StatusPill status={job.status} />
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{job.department}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {job.location}
            </span>
            <span>•</span>
            <span>{job.employmentType}</span>
            <span>•</span>
            <span className="text-slate-900 font-medium">{job.openingsCount} Openings</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/assessments/create">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Link New Assessment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Job Specs & Linked Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Job Description & Competencies */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Role Description & Linguistic Scope</CardTitle>
              <CardDescription>Target competencies evaluated during hiring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>{job.description}</p>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Key Linguistic Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Mandatory Language Benchmarks
                </span>
                <div className="flex flex-wrap gap-2">
                  {job.requiredLanguages.map((l, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50">
                      <span className="font-semibold text-slate-800">{l.language}</span>
                      <CefrBadge level={l.minCEFR} showLabel={true} />
                      {l.isMandatory && (
                        <span className="text-[10px] text-rose-600 font-medium">Mandatory</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Linked Assessments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Linked Linguistic Assessments</CardTitle>
              <CardDescription>Evaluation modules configured for this role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessments.length === 0 ? (
                <div className="text-xs text-slate-400 text-center py-4">
                  No assessments directly configured.
                </div>
              ) : (
                assessments.map((a) => (
                  <div key={a.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <Link href={`/dashboard/assessments/${a.id}`} className="font-semibold text-xs text-slate-900 hover:text-indigo-600">
                        {a.name}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>CEFR {a.languages[0]?.targetCEFR || "C1"} Benchmark</span>
                        <span>•</span>
                        <span>{a.candidatesCompletedCount} completed</span>
                      </div>
                    </div>
                    <Link href={`/dashboard/assessments/${a.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        View Assessment
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Assessed Candidates List */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Assessed Candidates ({candidates.length})</CardTitle>
                <Link href="/dashboard/candidates" className="text-xs text-indigo-600 hover:underline">
                  All candidates
                </Link>
              </div>
              <CardDescription>Candidates evaluated for this role</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {candidates.length === 0 ? (
                  <p className="p-6 text-xs text-center text-slate-400">No candidates assessed yet.</p>
                ) : (
                  candidates.map((c) => (
                    <Link
                      key={c.id}
                      href={`/dashboard/candidates/${c.id}`}
                      className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors block"
                    >
                      <div>
                        <span className="font-semibold text-xs text-slate-900 block">{c.name}</span>
                        <span className="text-[11px] text-slate-400">{c.email}</span>
                      </div>
                      <div className="text-right">
                        {c.achievedCEFR ? (
                          <CefrBadge level={c.achievedCEFR} />
                        ) : (
                          <StatusPill status={c.status} />
                        )}
                        {c.scorecard && (
                          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                            {c.scorecard.overallScore}/100
                          </span>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

