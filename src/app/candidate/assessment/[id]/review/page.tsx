"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  Mic,
  BookOpen,
  PenTool,
  Award,
  Send,
  ArrowLeft,
  FileCheck2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { useCandidateTestStore } from "@/store/candidate-test-store";

export default function CandidateReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const candidateName = useCandidateTestStore((s) => s.candidateName);
  const candidateEmail = useCandidateTestStore((s) => s.candidateEmail);
  const recordedBlobs = useCandidateTestStore((s) => s.recordedAudioBlobs);
  const readingAnswers = useCandidateTestStore((s) => s.readingAnswers);
  const wordCount = useCandidateTestStore((s) => s.writingWordCount);
  const certificateDetails = useCandidateTestStore((s) => s.certificateDetails);
  const submitAssessment = useCandidateTestStore((s) => s.submitAssessment);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await submitAssessment();
    setTimeout(() => {
      router.push(`/candidate/assessment/${id}/completed`);
    }, 1500);
  };

  const answeredQuestionsCount = Object.keys(readingAnswers).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader currentStepTitle="Final Submission Review" stepNumber={9} totalSteps={10} />

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10 space-y-6 animate-in fade-in duration-150">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Step 9 of 10 · Verification Summary
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Final Assessment Review
          </h1>
          <p className="text-xs text-slate-500">
            Verify your completed sections before final submission to your recruitment team.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submission Audit Summary</CardTitle>
            <CardDescription className="text-xs">
              Candidate: {candidateName} ({candidateEmail})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Checklist items */}
            <div className="space-y-3">
              {/* Speaking */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Speaking Responses</span>
                    <span className="text-slate-500 text-[11px]">Audio recordings captured via MediaRecorder</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Evaluation
                </span>
              </div>

              {/* Reading */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Reading Comprehension</span>
                    <span className="text-slate-500 text-[11px]">All multiple choice & vocabulary questions</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {answeredQuestionsCount} Questions Answered
                </span>
              </div>

              {/* Writing */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-700 flex items-center justify-center">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Professional Writing</span>
                    <span className="text-slate-500 text-[11px]">Executive scenario draft submission</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {wordCount} Words Drafted
                </span>
              </div>

              {/* Certificate */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Certificate Documentation</span>
                    <span className="text-slate-500 text-[11px]">
                      {certificateDetails ? `${certificateDetails.provider} (${certificateDetails.score})` : "No certificate attached"}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                  {certificateDetails ? "Attached" : "Skipped"}
                </span>
              </div>
            </div>

            {/* Final Submission Notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
              Once you click <strong>Finalize & Submit</strong>, your linguistic responses will be submitted for CEFR benchmarking. You will not be able to modify your answers after this point.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link href={`/candidate/assessment/${id}/writing`}>
                <Button type="button" variant="outline" size="sm" className="text-xs gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Writing
                </Button>
              </Link>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm px-6"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Finalizing Submission..." : "Finalize & Submit Assessment"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

