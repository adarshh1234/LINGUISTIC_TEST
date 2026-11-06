"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Shield, CheckCircle2, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { useCandidateTestStore } from "@/store/candidate-test-store";

export default function CandidateConsentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [audioConsent, setAudioConsent] = useState(true);
  const [aiConsent, setAiConsent] = useState(true);
  const [dataConsent, setDataConsent] = useState(true);

  const setConsents = useCandidateTestStore((s) => s.setConsents);

  const allConsented = audioConsent && aiConsent && dataConsent;

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allConsented) return;

    setConsents({
      audio: audioConsent,
      ai: aiConsent,
      data: dataConsent,
    });

    router.push(`/candidate/assessment/${id}/device-check`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader currentStepTitle="Privacy & Consent" stepNumber={2} totalSteps={10} />

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10 space-y-6 animate-in fade-in duration-150">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Step 2 of 10 · Compliance
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Privacy Notice & Explicit Consent
          </h1>
          <p className="text-xs text-slate-500">
            Please review our data protection safeguards and provide authorization for linguistic evaluation.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linguistic Evaluation Data Policy</CardTitle>
            <CardDescription className="text-xs">
              Compliant with General Data Protection Regulation (GDPR) and SOC2 Type II standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProceed} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 leading-relaxed space-y-2">
                <p>
                  During this assessment, the platform processes your verbal audio submissions, reading comprehension selections, and written essays solely to assess linguistic proficiency against CEFR benchmarks.
                </p>
                <p>
                  <strong>No Voice Biometric Profiling:</strong> Audio recordings are used exclusively for syntax, vocabulary, pronunciation, and pacing analysis. No biometric voiceprints are retained for identity recognition.
                </p>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={audioConsent}
                    onChange={(e) => setAudioConsent(e.target.checked)}
                    className="rounded text-indigo-600 mt-0.5"
                    required
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Audio Recording Authorization *</span>
                    <span className="text-[11px] text-slate-500 leading-snug">
                      I authorize the browser to record my spoken responses during speaking assessment questions for acoustic and syntactic evaluation.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={aiConsent}
                    onChange={(e) => setAiConsent(e.target.checked)}
                    className="rounded text-indigo-600 mt-0.5"
                    required
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">AI Linguistic Evaluation Consent *</span>
                    <span className="text-[11px] text-slate-500 leading-snug">
                      I consent to automated phonetic transcription and lexical scoring under the supervision of human talent evaluators.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={dataConsent}
                    onChange={(e) => setDataConsent(e.target.checked)}
                    className="rounded text-indigo-600 mt-0.5"
                    required
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Recruitment Evaluation Processing *</span>
                    <span className="text-[11px] text-slate-500 leading-snug">
                      I agree that my evaluation report may be reviewed by authorized recruiters and hiring decision makers for this open position.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Link href={`/candidate/assessment/${id}`}>
                  <Button type="button" variant="outline" size="sm" className="text-xs gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={!allConsented}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-sm"
                >
                  <span>Grant Consents & Test Devices</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

