"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  PenTool,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Save,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { useCandidateTestStore } from "@/store/candidate-test-store";
import { assessmentService } from "@/services/assessment.service";
import { Assessment, WritingTask } from "@/types/assessment.types";

export default function CandidateWritingAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [pasteBlockedWarning, setPasteBlockedWarning] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const writingText = useCandidateTestStore((s) => s.writingSubmission);
  const wordCount = useCandidateTestStore((s) => s.writingWordCount);
  const lastSavedAt = useCandidateTestStore((s) => s.writingLastSavedAt);
  const updateWritingText = useCandidateTestStore((s) => s.updateWritingText);
  const logIntegrityEvent = useCandidateTestStore((s) => s.logCandidateIntegrityEvent);
  const setCurrentModule = useCandidateTestStore((s) => s.setCurrentModule);

  const { secondsLeft } = useCountdownTimer({
    initialSeconds: 1200, // 20 mins
    autoStart: true,
    onExpire: () => {
      router.push(`/candidate/assessment/${id}/certificate`);
    },
  });

  useEffect(() => {
    setCurrentModule("writing");
    async function load() {
      if (!id) return;
      const a = await assessmentService.getAssessmentById(id);
      setAssessment(a);
    }
    load();
  }, [id, setCurrentModule]);

  const task: WritingTask = assessment?.writingConfig.task || {
    id: "wrt-task-1",
    title: "Executive Outage Follow-up & Remediation Notice",
    taskType: "PROFESSIONAL_EMAIL",
    instructions: "Draft a formal, high-stakes executive email to the VP of Engineering and Head of Procurement at a tier-1 client following an unscheduled service disruption.",
    scenarioContext: "Yesterday between 14:15 and 15:00 UTC, a database failover misconfiguration caused intermittent transaction timeouts for 42 enterprise accounts. The incident is fully remediated.",
    prompt: "Write an email addressing: 1) Sincere apology and impact acknowledgment, 2) Concise root cause explanation, 3) Corrective engineering measures deployed, and 4) Offer for a live briefing with your Lead Architect.",
    minWordCount: 150,
    maxWordCount: 350,
    timeLimitMinutes: 20,
    allowCopyPaste: false,
  };

  const minWords = task.minWordCount;
  const maxWords = task.maxWordCount;
  const isMinMet = wordCount >= minWords;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateWritingText(e.target.value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!task.allowCopyPaste) {
      e.preventDefault();
      setPasteBlockedWarning(true);
      logIntegrityEvent(
        "CLIPBOARD_INTERCEPTED",
        "HIGH",
        "Candidate attempted clipboard paste into writing editor."
      );
      setTimeout(() => setPasteBlockedWarning(false), 4000);
    }
  };

  const handleSubmitWriting = () => {
    if (!isMinMet) {
      setConfirmModalOpen(true);
    } else {
      router.push(`/candidate/assessment/${id}/certificate`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader
        currentStepTitle="Professional Writing"
        stepNumber={7}
        totalSteps={10}
        showTimer={true}
        timeRemainingSeconds={secondsLeft}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in duration-150">
        {/* Paste Blocked Warning Banner */}
        {pasteBlockedWarning && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Action Blocked:</strong> External clipboard pasting is disabled to ensure authentic writing evaluation. Please type your response directly into the editor.
              </span>
            </div>
            <button onClick={() => setPasteBlockedWarning(false)} className="font-bold text-rose-800 ml-2">
              ×
            </button>
          </div>
        )}

        {/* Task Briefing Card */}
        <Card className="border-pink-100 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600">
                Writing Task · {task.taskType.replace(/_/g, " ")}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                Word Goal: {minWords} – {maxWords} words
              </span>
            </div>
            <CardTitle className="text-base text-slate-900 mt-1">{task.title}</CardTitle>
            <CardDescription className="text-xs text-slate-600 leading-relaxed mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong>Scenario Context:</strong> {task.scenarioContext}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Required Deliverable:</p>
            <p className="leading-relaxed text-slate-600">{task.prompt}</p>
          </CardContent>
        </Card>

        {/* Writing Editor Card */}
        <Card className="shadow-xs">
          <CardContent className="p-5 space-y-4">
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className={isMinMet ? "text-emerald-600" : "text-amber-600"}>
                    {wordCount} Words
                  </span>
                  <span className="text-slate-400 font-normal">/ {minWords} min required</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-normal">{writingText.length} Characters</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                {lastSavedAt && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Auto-saved at {lastSavedAt}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Paste Policy: Restricted
                </span>
              </div>
            </div>

            {/* Word Count Progress Indicator */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  wordCount >= maxWords
                    ? "bg-rose-500"
                    : isMinMet
                    ? "bg-emerald-500"
                    : "bg-indigo-600"
                }`}
                style={{ width: `${Math.min(100, (wordCount / minWords) * 100)}%` }}
              />
            </div>

            {/* Textarea */}
            <textarea
              rows={14}
              placeholder="Type your formal response here..."
              value={writingText}
              onChange={handleTextChange}
              onPaste={handlePaste}
              className="w-full border border-slate-200 rounded-xl p-4 text-xs font-mono leading-relaxed outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-y"
            />

            {/* Editor Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-slate-500">
                {!isMinMet ? (
                  <span className="text-amber-600 font-medium">
                    ⚠️ {minWords - wordCount} more words required to meet the minimum threshold.
                  </span>
                ) : (
                  <span className="text-emerald-600 font-medium">
                    ✓ Minimum word threshold achieved ({wordCount} words).
                  </span>
                )}
              </div>

              <Button
                onClick={handleSubmitWriting}
                className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white text-xs gap-1.5 shadow-sm"
              >
                <span>Save Writing & Proceed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Under-Minimum Confirmation Modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogClose onClose={() => setConfirmModalOpen(false)} />
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <DialogTitle>Under Minimum Word Requirement</DialogTitle>
          </div>
          <DialogDescription>
            Your current essay has {wordCount} words, which is below the minimum requirement of {minWords} words.
          </DialogDescription>
        </DialogHeader>

        <p className="text-xs text-slate-600 leading-relaxed my-3">
          Submitting an incomplete draft may negatively impact your vocabulary and syntax scoring on the CEFR rubric. Are you sure you wish to submit?
        </p>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>
            Return to Editor
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setConfirmModalOpen(false);
              router.push(`/candidate/assessment/${id}/certificate`);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Submit Anyway
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

