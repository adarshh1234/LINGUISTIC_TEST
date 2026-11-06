"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mic,
  BookOpen,
  PenTool,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Globe2,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { assessmentService } from "@/services/assessment.service";
import { brandingService } from "@/services/branding.service";
import { Assessment } from "@/types/assessment.types";

export default function CandidateAssessmentHub() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const branding = brandingService.getBranding();

  useEffect(() => {
    async function load() {
      const list = await assessmentService.getAssessments();
      setAssessments(list);
    }
    load();
  }, []);

  const primaryAssessment = assessments[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader currentStepTitle="Candidate Assessment Hub" />

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-200">
        {/* Welcome Greeting */}
        <div className="space-y-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Candidate Evaluation Portal
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome, Candidate
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {branding.welcomeMessage}
          </p>
        </div>

        {/* Assigned Assessment Card */}
        {primaryAssessment && (
          <Card className="border-indigo-100 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                    Active Invitation · {primaryAssessment.jobTitle}
                  </span>
                  <CardTitle className="text-xl">{primaryAssessment.name}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <CefrBadge level={primaryAssessment.languages[0]?.targetCEFR || "C1"} showLabel={true} />
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-2">
                {primaryAssessment.assessmentDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              {/* Modules breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block">Speaking Module</span>
                    <span className="text-[11px] text-slate-500">
                      {primaryAssessment.speakingConfig.recordingDurationSeconds}s response time
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block">Reading Module</span>
                    <span className="text-[11px] text-slate-500">
                      {primaryAssessment.readingConfig.durationMinutes} mins timed section
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block">Writing Module</span>
                    <span className="text-[11px] text-slate-500">
                      {primaryAssessment.writingConfig.minWordCount}–{primaryAssessment.writingConfig.maxWordCount} words
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 text-xs text-slate-700">
                <h4 className="font-semibold text-slate-900">Before You Begin Checklist:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Quiet room with minimal background ambient noise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Functional microphone (wired headset recommended)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Stable broadband network connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Allow 45 undisturbed minutes for completion</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2">
                <Link href={`/candidate/assessment/${primaryAssessment.id}`}>
                  <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-2 px-8 py-2.5 shadow-sm">
                    <span>Begin Candidate Journey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Powered by Verbalis AI Linguistic Engine · CEFR ISO 27001 Compliant Platform
      </footer>
    </div>
  );
}

