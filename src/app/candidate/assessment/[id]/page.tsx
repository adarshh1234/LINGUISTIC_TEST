"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, UserCheck, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { assessmentService } from "@/services/assessment.service";
import { useCandidateTestStore } from "@/store/candidate-test-store";
import { Assessment } from "@/types/assessment.types";

export default function CandidateAssessmentIntro() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [candidateName, setCandidateName] = useState("Elena Rostova");
  const [candidateEmail, setCandidateEmail] = useState("elena.rostova@example.com");
  const [identityConfirmed, setIdentityConfirmed] = useState(false);

  const initSession = useCandidateTestStore((s) => s.initializeSession);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const a = await assessmentService.getAssessmentById(id);
      setAssessment(a);
    }
    load();
  }, [id]);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment || !identityConfirmed) return;

    initSession(
      {
        id: "cand-session-01",
        name: candidateName,
        email: candidateEmail,
      },
      assessment
    );

    router.push(`/candidate/assessment/${id}/consent`);
  };

  if (!assessment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader currentStepTitle="Identity Confirmation" stepNumber={1} totalSteps={10} />

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10 space-y-6 animate-in fade-in duration-150">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Step 1 of 10 · Identification
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Confirm Your Identity
          </h1>
          <p className="text-xs text-slate-500">
            Verify your candidate credentials prior to launching the proctored linguistic evaluation.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{assessment.name}</CardTitle>
                <CardDescription className="text-xs">{assessment.jobTitle}</CardDescription>
              </div>
              <CefrBadge level={assessment.languages[0]?.targetCEFR || "C1"} showLabel={true} />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProceed} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <Input
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Your full legal name as it appears on official ID"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registered Candidate Email</label>
                <Input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-semibold text-slate-900 block">Assessment Target Parameters:</span>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Target Language:</span>
                  <span className="font-bold text-slate-900">{assessment.languages[0]?.language}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Benchmark Standard:</span>
                  <span className="font-bold text-slate-900">CEFR {assessment.languages[0]?.targetCEFR}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Estimated Total Duration:</span>
                  <span className="font-bold text-slate-900">~45 minutes</span>
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={identityConfirmed}
                  onChange={(e) => setIdentityConfirmed(e.target.checked)}
                  className="rounded text-indigo-600 mt-0.5"
                  required
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  I confirm that I am the registered candidate and will complete this linguistic evaluation independently without third-party assistance or unapproved aids.
                </span>
              </label>

              <Button
                type="submit"
                disabled={!identityConfirmed}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-sm mt-2"
              >
                <span>Continue to Privacy & Consent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

