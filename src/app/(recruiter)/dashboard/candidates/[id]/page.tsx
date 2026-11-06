"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Mic,
  BookOpen,
  PenTool,
  Shield,
  Award,
  Sparkles,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  FileText,
  Volume2,
  History,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { WpmBadge } from "@/components/shared/wpm-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { AudioWaveform } from "@/components/shared/audio-waveform";
import { candidateService } from "@/services/candidate.service";
import { integrityService } from "@/services/integrity.service";
import { certificateService } from "@/services/certificate.service";
import { Candidate } from "@/types/candidate.types";
import { IntegrityEvent } from "@/types/integrity.types";
import { CertificateRecord } from "@/types/certificate.types";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

export default function CandidateDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      const [c, events, certs] = await Promise.all([
        candidateService.getCandidateById(id),
        integrityService.getEventsByCandidateId(id),
        certificateService.getCertificates(),
      ]);
      setCandidate(c);
      setIntegrityEvents(events);
      const matchCert = certs.find((item) => item.candidateId === id);
      if (matchCert) setCertificate(matchCert);
    }
    loadData();
  }, [id]);

  if (!candidate) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/candidates" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidates Directory
        </Link>
        <Card className="p-8 text-center text-slate-500 text-xs">Candidate profile not found.</Card>
      </div>
    );
  }

  const scorecard = candidate.scorecard;
  const radarData = scorecard
    ? [
        { subject: "Pronunciation", value: scorecard.speakingMetrics.pronunciationScore, fullMark: 100 },
        { subject: "Grammar", value: scorecard.speakingMetrics.grammarScore, fullMark: 100 },
        { subject: "Lexicon", value: scorecard.speakingMetrics.vocabularyScore, fullMark: 100 },
        { subject: "Fluency", value: scorecard.speakingMetrics.fluencyScore, fullMark: 100 },
        { subject: "Reading Comp", value: scorecard.readingMetrics.comprehensionScore, fullMark: 100 },
        { subject: "Writing Syntax", value: scorecard.writingMetrics.syntaxScore, fullMark: 100 },
        { subject: "Tone & Register", value: scorecard.writingMetrics.toneScore, fullMark: 100 },
      ]
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back Link */}
      <Link href="/dashboard/candidates" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Candidates Directory
      </Link>

      {/* Candidate Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-indigo-100 flex items-center justify-center font-bold text-lg text-indigo-700 shrink-0">
            {candidate.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{candidate.name}</h1>
              {candidate.achievedCEFR && <CefrBadge level={candidate.achievedCEFR} showLabel={true} />}
              <StatusPill status={candidate.status} />
              <StatusPill status={candidate.integrityStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {candidate.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {candidate.phone}
              </span>
              <span>•</span>
              <span className="font-medium text-slate-700">{candidate.jobTitle}</span>
            </div>
          </div>
        </div>

        {scorecard && (
          <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 rounded-xl p-4 shrink-0">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Overall Score</span>
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {scorecard.overallScore}<span className="text-sm font-normal text-slate-400">/100</span>
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Target vs Achieved</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CefrBadge level={candidate.targetCEFR} />
                <span className="text-slate-300">→</span>
                <CefrBadge level={candidate.achievedCEFR} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8 Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview">1. Overview</TabsTrigger>
          <TabsTrigger value="assessments">2. Assessments</TabsTrigger>
          <TabsTrigger value="speaking">3. Speaking</TabsTrigger>
          <TabsTrigger value="reading">4. Reading</TabsTrigger>
          <TabsTrigger value="writing">5. Writing</TabsTrigger>
          <TabsTrigger value="certificates">
            6. Certificates {certificate && "•"}
          </TabsTrigger>
          <TabsTrigger value="integrity">
            7. Integrity Timeline {integrityEvents.length > 0 && `(${integrityEvents.length})`}
          </TabsTrigger>
          <TabsTrigger value="activity">8. Activity History</TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview">
          {scorecard ? (
            <div className="space-y-6">
              {/* Top Row: Module Score Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 border-l-4 border-l-indigo-600">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Speaking Score</span>
                    <Mic className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900">{scorecard.speakingScore}/100</span>
                    <WpmBadge wpm={scorecard.speakingMetrics.wordsPerMinute} />
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Cadence: {scorecard.speakingMetrics.pacingClassification}
                  </span>
                </Card>

                <Card className="p-4 border-l-4 border-l-purple-600">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Reading Score</span>
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900">{scorecard.readingScore}/100</span>
                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {scorecard.readingMetrics.accuracyPercentage}% Accuracy
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {scorecard.readingMetrics.correctAnswersCount}/{scorecard.readingMetrics.totalQuestions} Questions Correct
                  </span>
                </Card>

                <Card className="p-4 border-l-4 border-l-pink-600">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Writing Score</span>
                    <PenTool className="w-4 h-4 text-pink-600" />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-slate-900">{scorecard.writingScore}/100</span>
                    <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {scorecard.writingMetrics.wordCount} Words
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Syntax & Executive Register
                  </span>
                </Card>
              </div>

              {/* Radar Chart & AI Synthesis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Multidimensional Competency Radar</CardTitle>
                    <CardDescription>Linguistic facets benchmarked against CEFR standards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
                          <Radar name="Candidate Score" dataKey="value" stroke="#6366f1" fill="#818cf8" fillOpacity={0.4} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                              fontSize: "11px",
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Explainable AI Executive Rationale */}
                <Card className="flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <CardTitle>Explainable AI Linguistic Evaluation</CardTitle>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {scorecard.explainableAIReport.confidenceScore}% Confidence
                      </span>
                    </div>
                    <CardDescription>Synthesized natural language proficiency analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-slate-800 leading-relaxed">
                      {scorecard.explainableAIReport.overallSummary}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Linguistic Strengths
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600">
                        {scorecard.explainableAIReport.strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    {scorecard.explainableAIReport.improvementAreas.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Improvement Opportunities
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-600">
                          {scorecard.explainableAIReport.improvementAreas.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>CEFR Standard: Common European Framework</span>
                      <span>Total Time: {scorecard.completionTimeMinutes} mins</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* "Why This Score?" Detailed Breakdown */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <CardTitle>Why This Score? — Granular Error & Dimension Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    Transparency layer detailing observed syntactic inaccuracies and rubric benchmark alignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Detected Linguistic Errors Table */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 mb-2">Detected Linguistic Errors & Recommended Corrections</h4>
                    {scorecard.explainableAIReport.detectedErrors.length === 0 ? (
                      <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">
                        Zero grammatical or phonetic violations detected in evaluated sample.
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                            <tr>
                              <th className="p-3 font-medium">Type</th>
                              <th className="p-3 font-medium">Candidate Output</th>
                              <th className="p-3 font-medium">Suggested Correction</th>
                              <th className="p-3 font-medium">Linguistic Rationale</th>
                              <th className="p-3 font-medium">Impact</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {scorecard.explainableAIReport.detectedErrors.map((err, i) => (
                              <tr key={i} className="hover:bg-slate-50/50">
                                <td className="p-3 font-semibold text-slate-800">{err.type}</td>
                                <td className="p-3 text-rose-700 font-mono bg-rose-50/50 rounded">&quot;{err.originalPhrase}&quot;</td>
                                <td className="p-3 text-emerald-700 font-mono bg-emerald-50/50 rounded">&quot;{err.suggestedCorrection}&quot;</td>
                                <td className="p-3 text-slate-600">{err.explanation}</td>
                                <td className="p-3">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      err.severity === "HIGH"
                                        ? "bg-rose-100 text-rose-700"
                                        : err.severity === "MEDIUM"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {err.severity}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Scoring Dimensions Breakdown */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 mb-2">Evaluated Rubric Dimensions</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {scorecard.explainableAIReport.scoringDimensions.map((dim, i) => (
                        <div key={i} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900">{dim.dimension}</span>
                            <span className="font-bold text-indigo-600">{dim.score}/100</span>
                          </div>
                          <p className="text-[11px] text-slate-600">{dim.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center text-slate-500 text-xs">
              Candidate has not submitted their assessment yet. Assessment status: {candidate.status}
            </Card>
          )}
        </TabsContent>

        {/* TAB 2: ASSESSMENTS */}
        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Record</CardTitle>
              <CardDescription>Linked assessment configuration and candidate progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{candidate.assessmentName}</h4>
                  <p className="text-slate-500 mt-0.5">Assessed Language: {candidate.assessedLanguage}</p>
                </div>
                <Link href={`/dashboard/assessments/${candidate.assessmentId}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Assessment Config →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: SPEAKING */}
        <TabsContent value="speaking">
          {scorecard ? (
            <div className="space-y-6">
              {/* Audio Playback & Waveform */}
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Audio Recording & Acoustic Metrics</CardTitle>
                  <CardDescription>Interactive playback and speech pacing telemetry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-md transition-all"
                      >
                        {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>
                      <div>
                        <span className="font-semibold text-xs text-white block">
                          Recorded Response Question 1
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Duration: {scorecard.speakingMetrics.speakingDurationSeconds} seconds · High-fidelity audio
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <WpmBadge wpm={scorecard.speakingMetrics.wordsPerMinute} />
                    </div>
                  </div>

                  {/* Waveform */}
                  <AudioWaveform isPlaying={isPlayingAudio} barCount={42} />

                  {/* Transcript Sample */}
                  {scorecard.speakingMetrics.transcriptSample && (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                      <span className="font-semibold text-slate-900 block mb-1">Automated Speech Transcript:</span>
                      <p className="italic text-slate-700 leading-relaxed">
                        &quot;{scorecard.speakingMetrics.transcriptSample}&quot;
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Speaking Metrics Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Pronunciation</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {scorecard.speakingMetrics.pronunciationScore}/100
                  </p>
                </Card>
                <Card className="p-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Fluency & Rhythm</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {scorecard.speakingMetrics.fluencyScore}/100
                  </p>
                </Card>
                <Card className="p-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Coherence & Logic</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {scorecard.speakingMetrics.coherenceScore}/100
                  </p>
                </Card>
                <Card className="p-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Words Per Minute</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {scorecard.speakingMetrics.wordsPerMinute} WPM
                  </p>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-8 text-center text-slate-400 text-xs">Speaking data unavailable.</Card>
          )}
        </TabsContent>

        {/* TAB 4: READING */}
        <TabsContent value="reading">
          {scorecard ? (
            <Card>
              <CardHeader>
                <CardTitle>Reading Comprehension Evaluation</CardTitle>
                <CardDescription>Accuracy and response speed across complex contextual passages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block font-medium">Passage Accuracy</span>
                    <span className="text-xl font-bold text-slate-900 mt-1 block">
                      {scorecard.readingMetrics.accuracyPercentage}%
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block font-medium">Questions Correct</span>
                    <span className="text-xl font-bold text-slate-900 mt-1 block">
                      {scorecard.readingMetrics.correctAnswersCount}/{scorecard.readingMetrics.totalQuestions}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block font-medium">Time Spent</span>
                    <span className="text-xl font-bold text-slate-900 mt-1 block">
                      {Math.round(scorecard.readingMetrics.timeSpentSeconds / 60)} mins
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-400 text-xs">Reading data unavailable.</Card>
          )}
        </TabsContent>

        {/* TAB 5: WRITING */}
        <TabsContent value="writing">
          {scorecard ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Candidate Written Submission</CardTitle>
                    <CardDescription>
                      Word Count: {scorecard.writingMetrics.wordCount} words · Character Count: {scorecard.writingMetrics.characterCount}
                    </CardDescription>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-pink-50 text-pink-700 font-bold text-xs border border-pink-200">
                    Writing Score: {scorecard.writingScore}/100
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                  {scorecard.writingMetrics.submissionText}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-slate-400 block">Syntax & Structure</span>
                    <span className="text-lg font-bold text-slate-900">{scorecard.writingMetrics.syntaxScore}/100</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-slate-400 block">Grammar Accuracy</span>
                    <span className="text-lg font-bold text-slate-900">{scorecard.writingMetrics.grammarScore}/100</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-slate-400 block">Tone & Register</span>
                    <span className="text-lg font-bold text-slate-900">{scorecard.writingMetrics.toneScore}/100</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-slate-400 block">Professionalism</span>
                    <span className="text-lg font-bold text-slate-900">{scorecard.writingMetrics.professionalismScore}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-slate-400 text-xs">Writing submission unavailable.</Card>
          )}
        </TabsContent>

        {/* TAB 6: CERTIFICATES */}
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Language Certifications</CardTitle>
              <CardDescription>Verified third-party standardized credentials</CardDescription>
            </CardHeader>
            <CardContent>
              {certificate ? (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{certificate.provider} Certification</span>
                      <span className="text-slate-500 block">Cert ID: {certificate.certificateNumber}</span>
                    </div>
                    <StatusPill status={certificate.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-slate-700">
                    <div>
                      <span className="text-slate-400 block">Reported Score</span>
                      <span className="font-semibold text-slate-900">{certificate.reportedScore} ({certificate.overallBand})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Exam Date</span>
                      <span className="font-semibold text-slate-900">{formatDate(certificate.testDate)}</span>
                    </div>
                  </div>

                  {certificate.auditNotes && (
                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-600">
                      <strong>Audit Notes:</strong> {certificate.auditNotes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No third-party language certificates submitted by candidate.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 7: INTEGRITY TIMELINE */}
        <TabsContent value="integrity">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Integrity Telemetry & Incident Timeline</CardTitle>
                  <CardDescription>Observed client-side browser telemetry events</CardDescription>
                </div>
                <StatusPill status={candidate.integrityStatus} />
              </div>
            </CardHeader>
            <CardContent>
              {integrityEvents.length === 0 ? (
                <div className="p-8 text-center text-emerald-600 text-xs bg-emerald-50 rounded-xl border border-emerald-200">
                  ✓ Clean assessment session. Zero tab switches, clipboard paste interruptions, or anomalous pauses detected.
                </div>
              ) : (
                <div className="space-y-3">
                  {integrityEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between text-xs gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            event.severity === "HIGH"
                              ? "bg-rose-100 text-rose-700"
                              : event.severity === "MEDIUM"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{event.eventType}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600">
                              {event.module}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-0.5 leading-snug">{event.details}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {formatDateTime(event.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            event.severity === "HIGH"
                              ? "bg-rose-100 text-rose-700"
                              : event.severity === "MEDIUM"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {event.severity} SEVERITY
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 8: ACTIVITY HISTORY */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Activity Log</CardTitle>
              <CardDescription>Audit trail of invitations, session starts, and completions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <Mail className="w-4 h-4 text-slate-400" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-900 block">Assessment Invitation Sent</span>
                  <span className="text-slate-500">Sent by Automated Recruitment Dispatch</span>
                </div>
                <span className="text-slate-400">{formatDateTime(candidate.invitedAt)}</span>
              </div>

              {candidate.startedAt && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <Play className="w-4 h-4 text-indigo-600" />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 block">Candidate Began Assessment</span>
                    <span className="text-slate-500">Microphone check passed; consents granted</span>
                  </div>
                  <span className="text-slate-400">{formatDateTime(candidate.startedAt)}</span>
                </div>
              )}

              {candidate.completedAt && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 block">Assessment Completed & Scorecard Generated</span>
                    <span className="text-slate-600">All 3 modules scored; explainable AI report generated</span>
                  </div>
                  <span className="text-slate-500">{formatDateTime(candidate.completedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

