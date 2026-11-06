import { CEFRLevel } from "./cefr.types";

export type AssessmentStatus = "Draft" | "Published" | "Active" | "Completed" | "Archived";

export type SpeakingMode = "STRUCTURED_PROMPT" | "AI_CONVERSATIONAL";

export interface SpeakingQuestion {
  id: string;
  order: number;
  title: string;
  scenario: string;
  prepTimeSeconds: number;
  recordTimeSeconds: number;
  hints: string[];
}

export interface ReadingQuestion {
  id: string;
  order: number;
  type: "MULTIPLE_CHOICE" | "VOCABULARY" | "CONTEXTUAL_COMPREHENSION" | "SENTENCE_ORDERING";
  questionText: string;
  options: string[];
  correctOptionIndex?: number; // Kept separate for scoring, not leaked to candidate
  explanation?: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  difficultyCEFR: CEFRLevel;
  wordCount: number;
  content: string;
  questions: ReadingQuestion[];
}

export type WritingTaskType =
  | "PROFESSIONAL_EMAIL"
  | "CUSTOMER_SERVICE_RESPONSE"
  | "TECHNICAL_SUMMARY"
  | "BUSINESS_COMMUNICATION"
  | "COMPLAINT_RESPONSE"
  | "WORKPLACE_SCENARIO";

export interface WritingTask {
  id: string;
  title: string;
  taskType: WritingTaskType;
  instructions: string;
  scenarioContext: string;
  prompt: string;
  minWordCount: number;
  maxWordCount: number;
  timeLimitMinutes: number;
  allowCopyPaste: boolean;
}

export interface LanguageTargetConfig {
  language: string;
  targetCEFR: CEFRLevel;
  isPrimary: boolean;
}

export interface ModuleWeights {
  speakingWeight: number;
  readingWeight: number;
  writingWeight: number;
}

export interface SpeakingConfig {
  enabled: boolean;
  mode: SpeakingMode;
  prepTimeSeconds: number;
  recordingDurationSeconds: number;
  maxAttempts: number;
  evaluationCriteria: {
    pronunciation: boolean;
    grammar: boolean;
    vocabulary: boolean;
    fluency: boolean;
    coherence: boolean;
    comprehension: boolean;
    responseRelevance: boolean;
  };
  questions: SpeakingQuestion[];
}

export interface ReadingConfig {
  enabled: boolean;
  durationMinutes: number;
  targetCEFR: CEFRLevel;
  passageType: string;
  passages: ReadingPassage[];
}

export interface WritingConfig {
  enabled: boolean;
  taskType: WritingTaskType;
  durationMinutes: number;
  minWordCount: number;
  maxWordCount: number;
  characterLimit: number;
  restrictCopyPaste: boolean;
  task: WritingTask;
}

export type CertificateProvider = "IELTS" | "TOEFL" | "GRE" | "JLPT" | "DELE" | "OTHER";

export interface CertificateConfig {
  requirement: "REQUIRED" | "OPTIONAL" | "DISABLED";
  acceptedProviders: CertificateProvider[];
}

export interface IntegrityConfig {
  tabSwitchingDetection: boolean;
  copyDetection: boolean;
  pasteDetection: boolean;
  fullscreenMonitoring: boolean;
  unusualPauseDetection: boolean;
  microphoneDisconnectDetection: boolean;
  networkInterruptionMonitoring: boolean;
}

export interface ConsentConfig {
  audioRecordingConsent: boolean;
  aiLanguageEvaluationConsent: boolean;
  dataProcessingConsent: boolean;
  retentionMonths: number;
  privacyNoticeText: string;
}

export interface Assessment {
  id: string;
  name: string;
  jobId: string;
  jobTitle: string;
  industry: string;
  jobDescription?: string;
  assessmentDescription: string;
  status: AssessmentStatus;
  nativeLanguage: string;
  languages: LanguageTargetConfig[];
  weights: ModuleWeights;
  speakingConfig: SpeakingConfig;
  readingConfig: ReadingConfig;
  writingConfig: WritingConfig;
  certificateConfig: CertificateConfig;
  integrityConfig: IntegrityConfig;
  consentConfig: ConsentConfig;
  candidatesInvitedCount: number;
  candidatesCompletedCount: number;
  createdAt: string;
  updatedAt: string;
}

