import { CEFRLevel, WpmClassification } from "./cefr.types";

export type CandidateAssessmentStatus =
  | "Invited"
  | "InProgress"
  | "UnderReview"
  | "Completed"
  | "Disqualified";

export type IntegrityRiskLevel = "Clean" | "Low" | "Medium" | "High";

export interface SpeakingMetrics {
  pronunciationScore: number; // 0-100
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  coherenceScore: number;
  comprehensionScore: number;
  responseRelevanceScore: number;
  totalWords: number;
  speakingDurationSeconds: number;
  wordsPerMinute: number;
  pacingClassification: WpmClassification;
  audioRecordingUrl?: string;
  transcriptSample?: string;
}

export interface WritingMetrics {
  grammarScore: number;
  syntaxScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  relevanceScore: number;
  structureScore: number;
  toneScore: number;
  professionalismScore: number;
  wordCount: number;
  characterCount: number;
  submissionText: string;
}

export interface ReadingMetrics {
  comprehensionScore: number;
  vocabularyScore: number;
  contextualUnderstandingScore: number;
  totalQuestions: number;
  correctAnswersCount: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
}

export interface LinguisticErrorItem {
  type: "GRAMMAR" | "SYNTAX" | "VOCABULARY" | "PRONUNCIATION" | "COHERENCE";
  originalPhrase: string;
  suggestedCorrection: string;
  explanation: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface ExplainableAIReport {
  overallSummary: string;
  strengths: string[];
  improvementAreas: string[];
  detectedErrors: LinguisticErrorItem[];
  scoringDimensions: {
    dimension: string;
    score: number;
    benchmarkCEFR: CEFRLevel;
    feedback: string;
  }[];
  cefrRationale: string;
  confidenceScore: number; // e.g. 94%
}

export interface CandidateScorecard {
  overallScore: number; // 0-100
  overallCEFR: CEFRLevel;
  targetCEFR: CEFRLevel;
  achievedCEFR: CEFRLevel;
  completionTimeMinutes: number;
  speakingScore: number;
  readingScore: number;
  writingScore: number;
  speakingMetrics: SpeakingMetrics;
  writingMetrics: WritingMetrics;
  readingMetrics: ReadingMetrics;
  explainableAIReport: ExplainableAIReport;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  jobId: string;
  jobTitle: string;
  assessmentId: string;
  assessmentName: string;
  assessedLanguage: string;
  status: CandidateAssessmentStatus;
  targetCEFR: CEFRLevel;
  achievedCEFR?: CEFRLevel;
  scorecard?: CandidateScorecard;
  certificateStatus: "None" | "Pending" | "Verified" | "Rejected";
  certificateId?: string;
  integrityStatus: IntegrityRiskLevel;
  integrityEventCount: number;
  invitedAt: string;
  startedAt?: string;
  completedAt?: string;
}

