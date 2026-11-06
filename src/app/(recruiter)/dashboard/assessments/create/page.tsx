"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  Layers,
  Globe2,
  Mic,
  BookOpen,
  PenTool,
  Shield,
  Award,
  FileText,
  Sliders,
  Save,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { useAssessmentBuilderStore } from "@/store/assessment-builder-store";
import { CEFRLevel } from "@/types/cefr.types";
import { SpeakingMode, WritingTaskType } from "@/types/assessment.types";

const STEPS = [
  { id: 1, label: "Basic Info", icon: FileText },
  { id: 2, label: "Languages", icon: Globe2 },
  { id: 3, label: "Modules & Weights", icon: Layers },
  { id: 4, label: "Speaking", icon: Mic },
  { id: 5, label: "Reading", icon: BookOpen },
  { id: 6, label: "Writing", icon: PenTool },
  { id: 7, label: "Certificates", icon: Award },
  { id: 8, label: "Integrity", icon: Shield },
  { id: 9, label: "Consent", icon: Sliders },
  { id: 10, label: "Review & Publish", icon: Check },
];

export default function AssessmentBuilderPage() {
  const router = useRouter();
  const builder = useAssessmentBuilderStore();
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const calculateTotalWeight = () => {
    let sum = 0;
    if (builder.speakingConfig.enabled) sum += Number(builder.weights.speakingWeight) || 0;
    if (builder.readingConfig.enabled) sum += Number(builder.weights.readingWeight) || 0;
    if (builder.writingConfig.enabled) sum += Number(builder.weights.writingWeight) || 0;
    return sum;
  };

  const handleNext = () => {
    builder.nextStep();
  };

  const handlePublish = async () => {
    const res = await builder.publish();
    if (res) {
      setSuccessBanner(`Assessment "${res.name}" published successfully!`);
      setTimeout(() => {
        router.push("/dashboard/assessments");
      }, 1500);
    }
  };

  const handleSaveDraft = async () => {
    const res = await builder.saveDraft();
    if (res) {
      setSuccessBanner(`Draft "${res.name}" saved!`);
      setTimeout(() => {
        router.push("/dashboard/assessments");
      }, 1200);
    }
  };

  const currentTotalWeight = calculateTotalWeight();
  const isWeightValid = currentTotalWeight === 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/assessments" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessments
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={builder.isSaving} className="text-xs gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </Button>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assessment Creation Wizard</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Step-by-step enterprise configuration for CEFR-aligned linguistic evaluation.
        </p>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isDone = builder.currentStep > s.id;
            const isCurrent = builder.currentStep === s.id;

            return (
              <button
                key={s.id}
                onClick={() => builder.setStep(s.id)}
                className={`flex flex-col items-center gap-1.5 p-1 rounded-lg transition-all ${
                  isCurrent ? "text-indigo-600 font-bold" : isDone ? "text-slate-800" : "text-slate-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                    isCurrent
                      ? "bg-indigo-600 text-white font-bold ring-4 ring-indigo-50"
                      : isDone
                      ? "bg-emerald-100 text-emerald-700 font-bold"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className="text-[11px] whitespace-nowrap">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Alert */}
      {builder.validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{builder.validationError}</span>
        </div>
      )}

      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* STEP CONTENT CONTAINER */}
      <Card>
        <CardContent className="p-6 md:p-8">
          {/* STEP 1: BASIC INFORMATION */}
          {builder.currentStep === 1 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 1: Basic Assessment Information</h3>
                <p className="text-xs text-slate-500">Provide the title, targeted job role, and assessment objective.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Name *</label>
                <Input
                  value={builder.name}
                  onChange={(e) => builder.updateField("name", e.target.value)}
                  placeholder="e.g. Bilingual Customer Operations - English C1 Benchmark"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title *</label>
                  <Input
                    value={builder.jobTitle}
                    onChange={(e) => builder.updateField("jobTitle", e.target.value)}
                    placeholder="e.g. Senior Technical Account Manager"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Sector</label>
                  <Input
                    value={builder.industry}
                    onChange={(e) => builder.updateField("industry", e.target.value)}
                    placeholder="e.g. Enterprise Cloud Computing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Purpose & Scope</label>
                <textarea
                  rows={3}
                  value={builder.assessmentDescription}
                  onChange={(e) => builder.updateField("assessmentDescription", e.target.value)}
                  placeholder="Outline the primary objectives and key linguistic skills being benchmarked..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: LANGUAGE CONFIGURATION */}
          {builder.currentStep === 2 && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 2: Language & CEFR Level Configuration</h3>
                <p className="text-xs text-slate-500">Define the candidate native language and target secondary language benchmarks.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Native Language</label>
                  <select
                    value={builder.nativeLanguage}
                    onChange={(e) => builder.updateField("nativeLanguage", e.target.value)}
                    className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-xs text-slate-700"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Portuguese">Portuguese</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Secondary Language</label>
                  <select
                    value={builder.languages[0]?.language || "English"}
                    onChange={(e) => {
                      const newLangs = [...builder.languages];
                      newLangs[0] = { ...newLangs[0], language: e.target.value };
                      builder.updateField("languages", newLangs);
                    }}
                    className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-xs text-slate-700"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Required CEFR Benchmark</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]).map((lvl) => {
                    const isSelected = builder.languages[0]?.targetCEFR === lvl;
                    return (
                      <div
                        key={lvl}
                        onClick={() => {
                          const newLangs = [...builder.languages];
                          newLangs[0] = { ...newLangs[0], targetCEFR: lvl };
                          builder.updateField("languages", newLangs);
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <CefrBadge level={lvl} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-800 mt-2">
                          {lvl === "A1"
                            ? "Beginner"
                            : lvl === "A2"
                            ? "Elementary"
                            : lvl === "B1"
                            ? "Intermediate"
                            : lvl === "B2"
                            ? "Upper Intermediate"
                            : lvl === "C1"
                            ? "Advanced"
                            : "Proficient"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ASSESSMENT MODULES & WEIGHT VALIDATION */}
          {builder.currentStep === 3 && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 3: Assessment Modules & Scoring Weights</h3>
                <p className="text-xs text-slate-500">
                  Enable/disable evaluation modules and assign weights. Total weight of enabled modules must equal 100%.
                </p>
              </div>

              {/* Module 1: Speaking */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Speaking Assessment</h4>
                      <p className="text-[11px] text-slate-500">Audio prompt recording or live AI interview simulation</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={builder.speakingConfig.enabled}
                      onChange={(e) =>
                        builder.updateField("speakingConfig", {
                          ...builder.speakingConfig,
                          enabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {builder.speakingConfig.enabled && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-4">
                    <span className="text-xs text-slate-600 font-medium">Scoring Weight (%):</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={builder.weights.speakingWeight}
                      onChange={(e) =>
                        builder.setWeights({
                          ...builder.weights,
                          speakingWeight: Number(e.target.value),
                        })
                      }
                      className="w-24 h-8 text-xs font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Module 2: Reading */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Reading Comprehension</h4>
                      <p className="text-[11px] text-slate-500">Timed passage reading, contextual vocabulary, and MCQs</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={builder.readingConfig.enabled}
                      onChange={(e) =>
                        builder.updateField("readingConfig", {
                          ...builder.readingConfig,
                          enabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {builder.readingConfig.enabled && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-4">
                    <span className="text-xs text-slate-600 font-medium">Scoring Weight (%):</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={builder.weights.readingWeight}
                      onChange={(e) =>
                        builder.setWeights({
                          ...builder.weights,
                          readingWeight: Number(e.target.value),
                        })
                      }
                      className="w-24 h-8 text-xs font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Module 3: Writing */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Professional Writing</h4>
                      <p className="text-[11px] text-slate-500">Executive emails, customer resolution, and technical synthesis</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={builder.writingConfig.enabled}
                      onChange={(e) =>
                        builder.updateField("writingConfig", {
                          ...builder.writingConfig,
                          enabled: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {builder.writingConfig.enabled && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-4">
                    <span className="text-xs text-slate-600 font-medium">Scoring Weight (%):</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={builder.weights.writingWeight}
                      onChange={(e) =>
                        builder.setWeights({
                          ...builder.weights,
                          writingWeight: Number(e.target.value),
                        })
                      }
                      className="w-24 h-8 text-xs font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Weight Validation Status Card */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isWeightValid
                    ? "bg-emerald-50/60 border-emerald-200 text-emerald-800"
                    : "bg-rose-50/60 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  {isWeightValid ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>
                    Total Configured Weight: <strong className="font-bold">{currentTotalWeight}%</strong> / 100%
                  </span>
                </div>
                {!isWeightValid && (
                  <span className="text-[11px] font-semibold text-rose-600">
                    Adjust module weights to sum to exactly 100%
                  </span>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: SPEAKING CONFIGURATION */}
          {builder.currentStep === 4 && (
            <div className="space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 4: Speaking Module Configuration</h3>
                <p className="text-xs text-slate-500">Configure delivery mode, timing limits, and phonetic evaluation criteria.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Speaking Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() =>
                      builder.updateField("speakingConfig", {
                        ...builder.speakingConfig,
                        mode: "STRUCTURED_PROMPT",
                      })
                    }
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      builder.speakingConfig.mode === "STRUCTURED_PROMPT"
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-semibold text-xs text-slate-900 block">Structured Prompt & Record</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Candidates view business scenarios, prepare with a countdown, and record verbal responses with waveform visualization.
                    </p>
                  </div>

                  <div
                    onClick={() =>
                      builder.updateField("speakingConfig", {
                        ...builder.speakingConfig,
                        mode: "AI_CONVERSATIONAL",
                      })
                    }
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      builder.speakingConfig.mode === "AI_CONVERSATIONAL"
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-semibold text-xs text-slate-900 block">AI Live Conversational Interview</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Interactive conversational dialogue simulation with real-time transcript streaming.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preparation Time (seconds)</label>
                  <Input
                    type="number"
                    value={builder.speakingConfig.prepTimeSeconds}
                    onChange={(e) =>
                      builder.updateField("speakingConfig", {
                        ...builder.speakingConfig,
                        prepTimeSeconds: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Recording Time (seconds)</label>
                  <Input
                    type="number"
                    value={builder.speakingConfig.recordingDurationSeconds}
                    onChange={(e) =>
                      builder.updateField("speakingConfig", {
                        ...builder.speakingConfig,
                        recordingDurationSeconds: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Retries Allowed</label>
                  <Input
                    type="number"
                    value={builder.speakingConfig.maxAttempts}
                    onChange={(e) =>
                      builder.updateField("speakingConfig", {
                        ...builder.speakingConfig,
                        maxAttempts: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Evaluation Criteria Dimensions</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-700">
                  {Object.keys(builder.speakingConfig.evaluationCriteria).map((key) => (
                    <label key={key} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(builder.speakingConfig.evaluationCriteria as any)[key]}
                        onChange={(e) =>
                          builder.updateField("speakingConfig", {
                            ...builder.speakingConfig,
                            evaluationCriteria: {
                              ...builder.speakingConfig.evaluationCriteria,
                              [key]: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: READING CONFIGURATION */}
          {builder.currentStep === 5 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 5: Reading Comprehension Configuration</h3>
                <p className="text-xs text-slate-500">Configure passage type, test duration, and question formats.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={builder.readingConfig.durationMinutes}
                    onChange={(e) =>
                      builder.updateField("readingConfig", {
                        ...builder.readingConfig,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passage Difficulty Benchmark</label>
                  <select
                    value={builder.readingConfig.targetCEFR}
                    onChange={(e) =>
                      builder.updateField("readingConfig", {
                        ...builder.readingConfig,
                        targetCEFR: e.target.value as CEFRLevel,
                      })
                    }
                    className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-xs text-slate-700"
                  >
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Passage Type / Context</label>
                <Input
                  value={builder.readingConfig.passageType}
                  onChange={(e) =>
                    builder.updateField("readingConfig", {
                      ...builder.readingConfig,
                      passageType: e.target.value,
                    })
                  }
                  placeholder="e.g. Master Service Level Agreements & Cloud Architecture Post-Mortems"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block mb-1">Configured Question Formats:</span>
                <p>• Multiple Choice Questions (Contextual Fact Extraction)</p>
                <p>• Vocabulary in Context (Nuance & Connotation Identification)</p>
                <p>• Sentence Ordering & Logical Flow</p>
              </div>
            </div>
          )}

          {/* STEP 6: WRITING CONFIGURATION */}
          {builder.currentStep === 6 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 6: Writing Assessment Configuration</h3>
                <p className="text-xs text-slate-500">Configure task genre, length constraints, and integrity restrictions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Writing Task Type</label>
                  <select
                    value={builder.writingConfig.taskType}
                    onChange={(e) =>
                      builder.updateField("writingConfig", {
                        ...builder.writingConfig,
                        taskType: e.target.value as WritingTaskType,
                      })
                    }
                    className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-xs text-slate-700"
                  >
                    <option value="PROFESSIONAL_EMAIL">Professional Email</option>
                    <option value="CUSTOMER_SERVICE_RESPONSE">Customer Service Response</option>
                    <option value="TECHNICAL_SUMMARY">Technical Summary</option>
                    <option value="BUSINESS_COMMUNICATION">Business Communication</option>
                    <option value="COMPLAINT_RESPONSE">Complaint Response</option>
                    <option value="WORKPLACE_SCENARIO">Workplace Scenario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Limit (minutes)</label>
                  <Input
                    type="number"
                    value={builder.writingConfig.durationMinutes}
                    onChange={(e) =>
                      builder.updateField("writingConfig", {
                        ...builder.writingConfig,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Word Requirement</label>
                  <Input
                    type="number"
                    value={builder.writingConfig.minWordCount}
                    onChange={(e) =>
                      builder.updateField("writingConfig", {
                        ...builder.writingConfig,
                        minWordCount: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Word Limit</label>
                  <Input
                    type="number"
                    value={builder.writingConfig.maxWordCount}
                    onChange={(e) =>
                      builder.updateField("writingConfig", {
                        ...builder.writingConfig,
                        maxWordCount: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Copy & Paste Restriction Policy</span>
                  <span className="text-[11px] text-slate-500">
                    Intercept clipboard paste events and trigger candidate warnings to ensure authentic writing.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builder.writingConfig.restrictCopyPaste}
                    onChange={(e) =>
                      builder.updateField("writingConfig", {
                        ...builder.writingConfig,
                        restrictCopyPaste: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 7: CERTIFICATE REQUIREMENTS */}
          {builder.currentStep === 7 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 7: Third-Party Certificate Requirements</h3>
                <p className="text-xs text-slate-500">Allow candidates to upload existing standardized language certifications.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Upload Requirement</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["OPTIONAL", "REQUIRED", "DISABLED"] as const).map((opt) => (
                    <div
                      key={opt}
                      onClick={() =>
                        builder.updateField("certificateConfig", {
                          ...builder.certificateConfig,
                          requirement: opt,
                        })
                      }
                      className={`p-3 rounded-lg border cursor-pointer text-center text-xs transition-all ${
                        builder.certificateConfig.requirement === opt
                          ? "border-indigo-600 bg-indigo-50 font-bold text-indigo-700"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Accepted Certification Bodies</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {["IELTS", "TOEFL", "GRE", "JLPT", "DELE", "OTHER"].map((provider) => (
                    <div key={provider} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50">
                      <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                      <span className="font-medium text-slate-800">{provider}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: INTEGRITY CONFIGURATION */}
          {builder.currentStep === 8 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 8: Integrity & Proctoring Signals</h3>
                <p className="text-xs text-slate-500">Configure client-side telemetry signals monitored during candidate tests.</p>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { key: "tabSwitchingDetection", label: "Tab Switching & Focus Loss Detection", desc: "Flag when candidate navigates to external browser tabs." },
                  { key: "copyDetection", label: "Text Copying Prevention", desc: "Prevent copying passage or question texts." },
                  { key: "pasteDetection", label: "External Paste Interception", desc: "Block pasting pre-written drafts into the editor." },
                  { key: "fullscreenMonitoring", label: "Fullscreen Enforcement", desc: "Require candidate to stay in focused assessment window." },
                  { key: "unusualPauseDetection", label: "Unusual Speaking Pause Detection", desc: "Detect unexpected prolonged silence during verbal response." },
                  { key: "microphoneDisconnectDetection", label: "Microphone Stream Monitoring", desc: "Notify recruiter if candidate mic stream disconnects." },
                  { key: "networkInterruptionMonitoring", label: "Network Connectivity Telemetry", desc: "Record transient connection drops and auto-save test state." },
                ].map((item) => (
                  <div key={item.key} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block">{item.label}</span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={(builder.integrityConfig as any)[item.key]}
                      onChange={(e) =>
                        builder.updateField("integrityConfig", {
                          ...builder.integrityConfig,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="rounded text-indigo-600 w-4 h-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: CANDIDATE CONSENT */}
          {builder.currentStep === 9 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 9: Privacy Notice & Candidate Consents</h3>
                <p className="text-xs text-slate-500">Configure explicit candidate opt-in notices under GDPR & international compliance.</p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builder.consentConfig.audioRecordingConsent}
                    onChange={(e) =>
                      builder.updateField("consentConfig", {
                        ...builder.consentConfig,
                        audioRecordingConsent: e.target.checked,
                      })
                    }
                    className="rounded text-indigo-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Audio Recording Explicit Consent</span>
                    <span className="text-[11px] text-slate-500">Candidate must explicitly authorize browser microphone recording.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builder.consentConfig.aiLanguageEvaluationConsent}
                    onChange={(e) =>
                      builder.updateField("consentConfig", {
                        ...builder.consentConfig,
                        aiLanguageEvaluationConsent: e.target.checked,
                      })
                    }
                    className="rounded text-indigo-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">AI Language Evaluation Consent</span>
                    <span className="text-[11px] text-slate-500">Candidate agrees to automated linguistic syntax and phonetic analysis.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builder.consentConfig.dataProcessingConsent}
                    onChange={(e) =>
                      builder.updateField("consentConfig", {
                        ...builder.consentConfig,
                        dataProcessingConsent: e.target.checked,
                      })
                    }
                    className="rounded text-indigo-600 mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">Recruitment Data Processing Consent</span>
                    <span className="text-[11px] text-slate-500">Strictly for hiring evaluation with configurable retention periods.</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Retention Period (Months)</label>
                <Input
                  type="number"
                  value={builder.consentConfig.retentionMonths}
                  onChange={(e) =>
                    builder.updateField("consentConfig", {
                      ...builder.consentConfig,
                      retentionMonths: Number(e.target.value),
                    })
                  }
                  className="w-32"
                />
              </div>
            </div>
          )}

          {/* STEP 10: REVIEW & PUBLISH */}
          {builder.currentStep === 10 && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Step 10: Final Configuration Review</h3>
                <p className="text-xs text-slate-500">Verify assessment parameters before publishing to candidate portal.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Role & Language</span>
                  <p><strong className="text-slate-900">Name:</strong> {builder.name}</p>
                  <p><strong className="text-slate-900">Role:</strong> {builder.jobTitle}</p>
                  <p>
                    <strong className="text-slate-900">Target Language:</strong> {builder.languages[0]?.language} (
                    <CefrBadge level={builder.languages[0]?.targetCEFR} />)
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Configured Weights</span>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 font-semibold">
                      Speaking: {builder.weights.speakingWeight}%
                    </span>
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 font-semibold">
                      Reading: {builder.weights.readingWeight}%
                    </span>
                    <span className="px-2 py-1 rounded bg-pink-100 text-pink-800 font-semibold">
                      Writing: {builder.weights.writingWeight}%
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Total Weight: 100% Validated</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-900 block mb-1">Integrity & Proctoring Highlights:</span>
                <p>• Tab Switch Detection: {builder.integrityConfig.tabSwitchingDetection ? "Enabled" : "Disabled"}</p>
                <p>• Copy/Paste Interception: {builder.integrityConfig.pasteDetection ? "Enabled" : "Disabled"}</p>
                <p>• Audio Recording Duration: {builder.speakingConfig.recordingDurationSeconds}s with {builder.speakingConfig.prepTimeSeconds}s prep</p>
                <p>• Writing Word Range: {builder.writingConfig.minWordCount} – {builder.writingConfig.maxWordCount} words</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => builder.prevStep()}
          disabled={builder.currentStep === 1}
          className="text-xs"
        >
          Previous Step
        </Button>

        <div className="flex items-center gap-3">
          {builder.currentStep < builder.totalSteps ? (
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={builder.isSaving || !isWeightValid}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Assessment</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

