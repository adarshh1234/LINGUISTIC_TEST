"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  Mic,
  BookOpen,
  PenTool,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { assessmentService } from "@/services/assessment.service";
import { Assessment } from "@/types/assessment.types";

export default function CandidateInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [understoodRules, setUnderstoodRules] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const a = await assessmentService.getAssessmentById(id);
      setAssessment(a);
    }
    load();
  }, [id]);

  const handleStart = () => {
    if (!understoodRules) return;
    router.push(`/candidate/assessment/${id}/speaking`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader currentStepTitle="Assessment Instructions" stepNumber={4} totalSteps={10} />

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10 space-y-6 animate-in fade-in duration-150">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Step 4 of 10 · Test Guidelines
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Assessment Instructions & Rules
          </h1>
          <p className="text-xs text-slate-500">
            Familiarize yourself with the timing and integrity guidelines for each module.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Testing Protocols & Structure</CardTitle>
            <CardDescription className="text-xs">
              Review how your linguistic competency is measured across each section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Section 1: Speaking */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Mic className="w-4 h-4 text-indigo-600" />
                <span>1. Speaking Assessment (~10 minutes)</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-6">
                You will be presented with workplace scenarios. You will have a countdown for preparation, followed by a recorded answer period. Speak naturally at a steady business cadence.
              </p>
            </div>

            {/* Section 2: Reading */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>2. Reading Comprehension (~15 minutes)</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-6">
                Read business passages on the left panel and answer corresponding comprehension and vocabulary questions on the right. You may flag questions to revisit before submitting.
              </p>
            </div>

            {/* Section 3: Writing */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <PenTool className="w-4 h-4 text-pink-600" />
                <span>3. Professional Writing (~20 minutes)</span>
              </div>
              <p className="text-slate-600 leading-relaxed pl-6">
                Compose an executive email or technical incident summary based on the scenario prompt. Respect minimum word thresholds. Clipboard paste actions are restricted.
              </p>
            </div>

            {/* Integrity Warning */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>Proctoring Notice:</strong> Navigating away from the active browser tab or attempting to paste external text will be logged as an integrity review signal for your hiring team.
              </p>
            </div>

            {/* Acknowledgment */}
            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={understoodRules}
                onChange={(e) => setUnderstoodRules(e.target.checked)}
                className="rounded text-indigo-600 mt-0.5"
                required
              />
              <span className="text-[11px] text-slate-700 leading-snug">
                I have read and understood the assessment instructions and agree to begin the evaluation now.
              </span>
            </label>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link href={`/candidate/assessment/${id}/device-check`}>
                <Button type="button" variant="outline" size="sm" className="text-xs gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Button>
              </Link>

              <Button
                type="button"
                onClick={handleStart}
                disabled={!understoodRules}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-sm"
              >
                <span>Start Speaking Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

