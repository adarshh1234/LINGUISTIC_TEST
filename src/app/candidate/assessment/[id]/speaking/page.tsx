"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Send,
  Volume2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User,
  Radio,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { AudioWaveform } from "@/components/shared/audio-waveform";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useCountdownTimer } from "@/hooks/use-countdown-timer";
import { useCandidateTestStore } from "@/store/candidate-test-store";
import { assessmentService } from "@/services/assessment.service";
import { Assessment, SpeakingQuestion } from "@/types/assessment.types";
import { formatDuration } from "@/lib/utils";

export default function CandidateSpeakingAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [activeMode, setActiveMode] = useState<"STRUCTURED" | "LIVE_AI">("STRUCTURED");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(30);
  const [isPrepping, setIsPrepping] = useState(true);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [uploadSimulated, setUploadSimulated] = useState(false);

  // Live AI Simulation State
  const [aiStep, setAiStep] = useState(0);
  const [aiStatus, setAiStatus] = useState<"speaking" | "listening" | "processing">("speaking");
  const [transcriptHistory, setTranscriptHistory] = useState([
    {
      sender: "AI_INTERVIEWER",
      text: "Good morning! Thank you for joining this verbal linguistic session. To begin, could you introduce yourself and describe a high-stakes customer escalation you recently resolved?",
      timestamp: "10:00:15",
    },
  ]);

  const {
    status: recorderStatus,
    durationSeconds,
    audioLevel,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder();

  const saveRecording = useCandidateTestStore((s) => s.saveSpeakingRecording);
  const setCurrentModule = useCandidateTestStore((s) => s.setCurrentModule);

  useEffect(() => {
    setCurrentModule("speaking");
    async function load() {
      if (!id) return;
      const a = await assessmentService.getAssessmentById(id);
      setAssessment(a);
    }
    load();
  }, [id, setCurrentModule]);

  // Preparation Countdown Timer
  useEffect(() => {
    if (!isPrepping || prepSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setPrepSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsPrepping(false);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPrepping, prepSecondsLeft, startRecording]);

  const currentQuestion = assessment?.speakingConfig.questions[currentQuestionIndex] || {
    id: "spk-q1",
    order: 1,
    title: "Executive Incident De-escalation Briefing",
    scenario: "You are speaking to the Chief Technology Officer of a Fortune 500 client whose mission-critical workflow suffered an unexpected 45-minute outage during end-of-quarter billing. They are demanding immediate remediation and contract SLA review.",
    prepTimeSeconds: 30,
    recordTimeSeconds: 120,
    hints: [
      "Acknowledge the disruption with genuine ownership and composure.",
      "Explain the technical root cause remediation without jargon.",
      "Propose a structured executive review cadence and follow-up plan.",
    ],
  };

  const handleSkipPrep = () => {
    setIsPrepping(false);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSaveAndNext = () => {
    if (audioUrl) {
      saveRecording(currentQuestion.id, audioUrl, "Candidate speaking submission recorded locally.");
    }
    setUploadSimulated(true);

    setTimeout(() => {
      setUploadSimulated(false);
      if (assessment && currentQuestionIndex < assessment.speakingConfig.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsPrepping(true);
        setPrepSecondsLeft(30);
        resetRecording();
      } else {
        router.push(`/candidate/assessment/${id}/reading`);
      }
    }, 1000);
  };

  // AI Interviewer Interaction Simulation
  const handleCandidateReplyLive = () => {
    setAiStatus("processing");
    const newEntry = {
      sender: "CANDIDATE",
      text: "During our recent database outage, I immediately convened a cross-functional incident squad, established an hourly executive communication cadence with the client's VP of Engineering, and deployed our schema rollback within 42 minutes.",
      timestamp: new Date().toLocaleTimeString(),
    };
    setTranscriptHistory((prev) => [...prev, newEntry]);

    setTimeout(() => {
      setAiStatus("speaking");
      setTranscriptHistory((prev) => [
        ...prev,
        {
          sender: "AI_INTERVIEWER",
          text: "Excellent ownership. When the client initially requested full contract termination, what specific diplomatic phrasing did you employ to restore trust while adhering to governance bounds?",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader
        currentStepTitle="Speaking Assessment"
        stepNumber={5}
        totalSteps={10}
        showTimer={true}
        timeRemainingSeconds={isPrepping ? prepSecondsLeft : Math.max(0, 120 - durationSeconds)}
      />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in duration-150">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 pl-2">Mode:</span>
            <button
              onClick={() => setActiveMode("STRUCTURED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "STRUCTURED"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Mode A: Structured Prompt & Record
            </button>
            <button
              onClick={() => setActiveMode("LIVE_AI")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMode === "LIVE_AI"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Mode B: Live AI Interview</span>
              <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-1.5 py-0.2 rounded-full">
                DEMO
              </span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline pr-2">
            Question {currentQuestionIndex + 1} of 2
          </span>
        </div>

        {/* MODE A: STRUCTURED PROMPT & RECORD */}
        {activeMode === "STRUCTURED" && (
          <div className="space-y-6">
            {/* Scenario Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    Spoken Response Scenario
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Target: CEFR {assessment?.languages[0]?.targetCEFR || "C1"}
                  </span>
                </div>
                <CardTitle className="text-lg mt-1">{currentQuestion.title}</CardTitle>
                <CardDescription className="text-xs text-slate-700 leading-relaxed mt-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {currentQuestion.scenario}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Recommended Discussion Points:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  {currentQuestion.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Preparation Countdown Banner */}
            {isPrepping && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {prepSecondsLeft}s
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950">Preparation Time Active</h4>
                    <p className="text-[11px] text-indigo-800">
                      Organize your thoughts. Recording begins automatically when the timer reaches 0.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleSkipPrep}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs whitespace-nowrap"
                >
                  Start Recording Now →
                </Button>
              </div>
            )}

            {/* Live Recording Console */}
            <Card className="border-2 border-slate-200">
              <CardContent className="p-6 space-y-6">
                {/* Audio Waveform */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      {recorderStatus === "recording" ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                          <span className="text-rose-600 font-bold">LIVE MICROPHONE STREAM RECORDING</span>
                        </>
                      ) : recorderStatus === "completed" ? (
                        <span className="text-emerald-700 font-bold">✓ Audio Recorded Successfully</span>
                      ) : (
                        <span className="text-slate-500">Audio Input Standby</span>
                      )}
                    </span>

                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatDuration(durationSeconds)} / 02:00
                    </span>
                  </div>

                  <AudioWaveform
                    isRecording={recorderStatus === "recording"}
                    isPlaying={isPlayingBack}
                    audioLevel={audioLevel}
                    barCount={48}
                  />
                </div>

                {/* Recorder Control Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {recorderStatus === "recording" ? (
                      <Button
                        onClick={handleStopRecording}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Recording</span>
                      </Button>
                    ) : recorderStatus === "idle" && !isPrepping ? (
                      <Button
                        onClick={() => startRecording()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Start Recording</span>
                      </Button>
                    ) : null}

                    {audioUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPlayingBack(!isPlayingBack)}
                        className="text-xs gap-1.5"
                      >
                        {isPlayingBack ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlayingBack ? "Pause Playback" : "Play Back Recording"}</span>
                      </Button>
                    )}

                    {recorderStatus === "completed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          resetRecording();
                          setIsPrepping(true);
                          setPrepSecondsLeft(30);
                        }}
                        className="text-xs text-slate-600 hover:text-slate-900 gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry Recording</span>
                      </Button>
                    )}
                  </div>

                  {recorderStatus === "completed" && (
                    <Button
                      onClick={handleSaveAndNext}
                      disabled={uploadSimulated}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
                    >
                      <span>{uploadSimulated ? "Saving Response..." : "Confirm & Save Response"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                {/* Disclaimer */}
                <p className="text-[11px] text-slate-400 text-center">
                  * Local microphone audio captured via standard browser MediaRecorder API. No external cloud transmission occurs in standalone prototype mode.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MODE B: LIVE CONVERSATIONAL INTERVIEW SIMULATION */}
        {activeMode === "LIVE_AI" && (
          <Card className="border-indigo-200 shadow-md">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-sm">AI Conversational Linguistic Partner</CardTitle>
                    <CardDescription className="text-slate-400 text-xs">
                      Live interactive dialogue simulation · CEFR C1 Evaluator
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-300 font-mono">
                    Status: {aiStatus === "speaking" ? "AI Speaking" : aiStatus === "listening" ? "Candidate Turn" : "Synthesizing..."}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Transcript Chat Window */}
              <div className="space-y-4 max-h-80 overflow-y-auto p-4 rounded-xl bg-slate-50 border border-slate-200">
                {transcriptHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 text-xs ${
                      item.sender === "AI_INTERVIEWER" ? "items-start" : "items-start flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] ${
                        item.sender === "AI_INTERVIEWER" ? "bg-indigo-600" : "bg-emerald-600"
                      }`}
                    >
                      {item.sender === "AI_INTERVIEWER" ? "AI" : "YOU"}
                    </div>
                    <div
                      className={`p-3 rounded-xl max-w-lg leading-relaxed ${
                        item.sender === "AI_INTERVIEWER"
                          ? "bg-white border border-slate-200 text-slate-800 shadow-xs"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-950 text-right"
                      }`}
                    >
                      <p>{item.text}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulation Response Trigger */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mic className="w-4 h-4 text-indigo-600" />
                  <span>Interactive dialogue simulation is ready for candidate input.</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCandidateReplyLive}
                    disabled={aiStatus === "processing"}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Deliver Candidate Spoken Response</span>
                  </Button>

                  <Button
                    onClick={() => router.push(`/candidate/assessment/${id}/reading`)}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Next to Reading →
                  </Button>
                </div>
              </div>

              {/* Clear Demo Marker */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Prototype Demo Mode:</strong> This conversational interview simulation demonstrates frontend interaction patterns without connecting to external paid Gemini or speech APIs.
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

