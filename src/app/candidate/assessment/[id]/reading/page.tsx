"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Flag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { useCandidateTestStore } from "@/store/candidate-test-store";
import { assessmentService } from "@/services/assessment.service";
import { Assessment, ReadingQuestion } from "@/types/assessment.types";

export default function CandidateReadingAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const readingAnswers = useCandidateTestStore((s) => s.readingAnswers);
  const selectAnswer = useCandidateTestStore((s) => s.selectReadingAnswer);
  const flaggedQuestions = useCandidateTestStore((s) => s.flaggedQuestions);
  const toggleFlag = useCandidateTestStore((s) => s.toggleFlagQuestion);
  const setCurrentModule = useCandidateTestStore((s) => s.setCurrentModule);

  const { secondsLeft } = useCountdownTimer({
    initialSeconds: 900, // 15 mins
    autoStart: true,
    onExpire: () => {
      router.push(`/candidate/assessment/${id}/writing`);
    },
  });

  useEffect(() => {
    setCurrentModule("reading");
    async function load() {
      if (!id) return;
      const a = await assessmentService.getAssessmentById(id);
      setAssessment(a);
    }
    load();
  }, [id, setCurrentModule]);

  const passage = assessment?.readingConfig.passages[0] || {
    id: "rd-pass-1",
    title: "Multi-Region Cloud Architecture & SLA Remedies",
    difficultyCEFR: "C1",
    wordCount: 380,
    content: `Section 4.3: Service Credits and Downtime Remediation\n\nUnder the terms of the Master Subscription Agreement (MSA), Downtime is defined as the verified total unavailability of the primary API gateway across two or more redundant Availability Zones, excluding scheduled maintenance windows announced at least 72 hours in advance.\n\nIn the event of an Unscheduled Service Interruption exceeding 0.05% of total calendar hours in any rolling billing period (calculated as 99.95% Availability), Customer shall become eligible for tiered Service Credits upon written notice submitted within thirty (30) calendar days following the conclusion of the affected month. Service Credits are pegged against the monthly equivalent subscription fee and are non-refundable, non-transferable, and redeemable solely as future billing deductions against renewal cycles.\n\nSection 4.4: Force Majeure & Third-Party Dependencies\n\nRemedies outlined herein shall be rendered void if service failure arises primarily from catastrophic carrier-grade network degradations, sovereign state actions, or unmitigated denial-of-service volumetric surges exceeding provisioned edge mitigation bandwidth thresholds. The burden of evidentiary verification shall reside with the Provider, who must furnish an independently audited telemetry log within ten (10) business days following incident resolution.`,
    questions: [
      {
        id: "rd-q1",
        order: 1,
        type: "MULTIPLE_CHOICE" as const,
        questionText: "According to Section 4.3, under what condition is downtime officially recognized under the SLA?",
        options: [
          "Whenever any single microservice experiences latency above 200 milliseconds.",
          "When the primary API gateway is completely unavailable across two or more Availability Zones, excluding pre-announced maintenance.",
          "When scheduled maintenance extends beyond 24 consecutive hours.",
          "Whenever the customer experiences local connectivity issues with their Internet service provider.",
        ],
      },
      {
        id: "rd-q2",
        order: 2,
        type: "VOCABULARY" as const,
        questionText: "In the context of Section 4.3, what is the meaning of the word 'pegged' in the phrase 'pegged against the monthly equivalent subscription fee'?",
        options: [
          "Fastened with a mechanical wooden or plastic pin",
          "Calculated or proportioned relative to an established financial benchmark",
          "Arbitrarily reduced without mutual stakeholder consent",
          "Permanently revoked due to contract breach",
        ],
      },
      {
        id: "rd-q3",
        order: 3,
        type: "CONTEXTUAL_COMPREHENSION" as const,
        questionText: "Which statement accurately represents the customer's entitlement to Service Credits?",
        options: [
          "Credits are deposited automatically as cash into the client's corporate bank account within 3 business days.",
          "Credits may be liquidated for cash at contract termination.",
          "Credits require formal written notice within 30 days and are redeemable solely as billing deductions against future renewal fees.",
          "Credits are guaranteed unconditionally even during sovereign state cyber-conflicts.",
        ],
      },
    ],
  };

  const questions = passage.questions;
  const currentQ = questions[currentQuestionIndex];
  const selectedOption = currentQ ? readingAnswers[currentQ.id] : undefined;
  const isFlagged = currentQ ? !!flaggedQuestions[currentQ.id] : false;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      router.push(`/candidate/assessment/${id}/writing`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader
        currentStepTitle="Reading Comprehension"
        stepNumber={6}
        totalSteps={10}
        showTimer={true}
        timeRemainingSeconds={secondsLeft}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in duration-150">
        {/* Navigation Breadcrumb / Question Palette */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-slate-800">
              Reading Section · CEFR {passage.difficultyCEFR}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {questions.map((q, idx) => {
              const isAnswered = readingAnswers[q.id] !== undefined;
              const isCurrent = currentQuestionIndex === idx;
              const flagged = flaggedQuestions[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all relative ${
                    isCurrent
                      ? "bg-purple-600 text-white shadow-xs"
                      : isAnswered
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {idx + 1}
                  {flagged && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Split Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT PANEL: PASSAGE TEXT */}
          <Card className="shadow-xs lg:sticky lg:top-24">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                  Comprehension Passage
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {passage.wordCount} words · {passage.difficultyCEFR} Level
                </span>
              </div>
              <CardTitle className="text-base text-slate-900 mt-1">{passage.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 max-h-[60vh] overflow-y-auto">
              <div className="text-xs text-slate-700 leading-relaxed font-serif space-y-3 whitespace-pre-line">
                {passage.content}
              </div>
            </CardContent>
          </Card>

          {/* RIGHT PANEL: QUESTION PANEL */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {questions.length} · {currentQ.type.replace(/_/g, " ")}
                </span>
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    isFlagged
                      ? "bg-amber-50 border-amber-300 text-amber-800 font-semibold"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isFlagged ? "Flagged for Review" : "Flag Question"}</span>
                </button>
              </div>

              <CardTitle className="text-sm font-semibold text-slate-900 leading-snug mt-2">
                {currentQ.questionText}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Options List */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => selectAnswer(currentQ.id, optIdx)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-purple-600 bg-purple-50/60 text-purple-950 font-medium ring-1 ring-purple-600"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "border-slate-300 text-slate-500"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="leading-snug">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="text-xs"
                >
                  Previous Question
                </Button>

                <Button
                  size="sm"
                  onClick={handleNextQuestion}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 shadow-sm"
                >
                  <span>
                    {currentQuestionIndex < questions.length - 1
                      ? "Next Question"
                      : "Complete Reading & Proceed"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

