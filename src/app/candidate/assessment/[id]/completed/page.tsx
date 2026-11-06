"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Mail, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { brandingService } from "@/services/branding.service";
import { useCandidateTestStore } from "@/store/candidate-test-store";

export default function CandidateCompletedPage() {
  const branding = brandingService.getBranding();
  const candidateName = useCandidateTestStore((s) => s.candidateName);
  const candidateEmail = useCandidateTestStore((s) => s.candidateEmail);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <CandidateHeader currentStepTitle="Assessment Submitted" stepNumber={10} totalSteps={10} />

      <main className="flex-1 max-w-xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assessment Completed Successfully
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-slate-900">{candidateName}</span>. Your speaking recordings, reading selections, and written essays have been received.
          </p>
        </div>

        <Card className="w-full text-left shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Submission Receipt
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Candidate Account:</span>
              <span className="font-semibold text-slate-900">{candidateEmail}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Submission Timestamp:</span>
              <span className="font-semibold text-slate-900">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Modules Processed:</span>
              <span className="font-semibold text-slate-900">Speaking · Reading · Writing</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Status:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Delivered to Hiring Team
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 p-3 rounded-lg bg-slate-50 text-slate-600 text-[11px] leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-1">What Happens Next?</span>
              Your linguistic benchmark results and explainable rubric scorecards are transmitted directly to the talent acquisition department at {branding.organizationName}. A recruitment representative will contact you with subsequent interview steps.
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link href="/dashboard" className="w-full">
            <Button variant="outline" className="w-full text-xs text-slate-700 gap-1.5">
              <span>Switch to Recruiter Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              Return to Platform Home
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Verbalis AI Multilingual Linguistic Assessment Platform
      </footer>
    </div>
  );
}

