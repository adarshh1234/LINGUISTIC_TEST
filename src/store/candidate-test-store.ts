import { create } from "zustand";
import { Assessment } from "@/types/assessment.types";
import { integrityService } from "@/services/integrity.service";

interface CandidateTestState {
  candidateName: string;
  candidateEmail: string;
  candidateId: string;
  assessmentId: string;
  assessment: Assessment | null;

  // Consents given
  consentAudio: boolean;
  consentAi: boolean;
  consentData: boolean;

  // Device check
  micTested: boolean;
  micPermissionGranted: boolean;
  networkTested: boolean;
  networkSpeedMbps: number;

  // Module Progress
  currentModule: "none" | "speaking" | "reading" | "writing" | "certificate" | "review";

  // Speaking state
  recordedAudioBlobs: Record<string, string>; // questionId -> audio blob URL
  speakingTranscripts: Record<string, string>;

  // Reading state
  readingAnswers: Record<string, number>; // questionId -> optionIndex
  flaggedQuestions: Record<string, boolean>;

  // Writing state
  writingSubmission: string;
  writingWordCount: number;
  writingLastSavedAt: string | null;

  // Certificate upload
  certificateUploaded: boolean;
  certificateDetails: {
    provider: string;
    certNumber: string;
    score: string;
    fileName: string;
  } | null;

  // Submission Status
  isSubmitted: boolean;

  // Actions
  initializeSession: (candidate: { id: string; name: string; email: string }, assessment: Assessment) => void;
  setConsents: (consents: { audio: boolean; ai: boolean; data: boolean }) => void;
  setDeviceCheck: (data: { micTested: boolean; micPermissionGranted: boolean; networkTested: boolean; networkSpeedMbps: number }) => void;
  setCurrentModule: (mod: CandidateTestState["currentModule"]) => void;
  saveSpeakingRecording: (questionId: string, blobUrl: string, transcript?: string) => void;
  selectReadingAnswer: (questionId: string, optionIndex: number) => void;
  toggleFlagQuestion: (questionId: string) => void;
  updateWritingText: (text: string) => void;
  setCertificateUpload: (details: CandidateTestState["certificateDetails"]) => void;
  logCandidateIntegrityEvent: (eventType: any, severity: any, details: string, metadata?: any) => Promise<void>;
  submitAssessment: () => Promise<void>;
  resetSession: () => void;
}

export const useCandidateTestStore = create<CandidateTestState>((set, get) => ({
  candidateName: "Elena Rostova",
  candidateEmail: "elena.rostova@example.com",
  candidateId: "cand-001",
  assessmentId: "asm-001",
  assessment: null,

  consentAudio: true,
  consentAi: true,
  consentData: true,

  micTested: true,
  micPermissionGranted: true,
  networkTested: true,
  networkSpeedMbps: 84.5,

  currentModule: "none",

  recordedAudioBlobs: {},
  speakingTranscripts: {},

  readingAnswers: {},
  flaggedQuestions: {},

  writingSubmission: "",
  writingWordCount: 0,
  writingLastSavedAt: null,

  certificateUploaded: false,
  certificateDetails: null,

  isSubmitted: false,

  initializeSession: (candidate, assessment) => {
    set({
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      assessmentId: assessment.id,
      assessment,
    });
  },

  setConsents: (consents) => {
    set({
      consentAudio: consents.audio,
      consentAi: consents.ai,
      consentData: consents.data,
    });
  },

  setDeviceCheck: (data) => {
    set({ ...data });
  },

  setCurrentModule: (mod) => {
    set({ currentModule: mod });
  },

  saveSpeakingRecording: (questionId, blobUrl, transcript) => {
    set((state) => ({
      recordedAudioBlobs: { ...state.recordedAudioBlobs, [questionId]: blobUrl },
      speakingTranscripts: transcript ? { ...state.speakingTranscripts, [questionId]: transcript } : state.speakingTranscripts,
    }));
  },

  selectReadingAnswer: (questionId, optionIndex) => {
    set((state) => ({
      readingAnswers: { ...state.readingAnswers, [questionId]: optionIndex },
    }));
  },

  toggleFlagQuestion: (questionId) => {
    set((state) => ({
      flaggedQuestions: { ...state.flaggedQuestions, [questionId]: !state.flaggedQuestions[questionId] },
    }));
  },

  updateWritingText: (text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    set({
      writingSubmission: text,
      writingWordCount: words,
      writingLastSavedAt: new Date().toLocaleTimeString(),
    });
  },

  setCertificateUpload: (details) => {
    set({
      certificateUploaded: !!details,
      certificateDetails: details,
    });
  },

  logCandidateIntegrityEvent: async (eventType, severity, details, metadata) => {
    const { candidateId, candidateName, assessmentId, currentModule } = get();
    await integrityService.logEvent({
      candidateId,
      candidateName,
      assessmentId,
      assessmentName: "Candidate Assessment Session",
      module: currentModule === "speaking" ? "Speaking" : currentModule === "reading" ? "Reading" : currentModule === "writing" ? "Writing" : "General",
      eventType,
      severity,
      details,
      metadata,
    });
  },

  submitAssessment: async () => {
    set({ isSubmitted: true });
  },

  resetSession: () => {
    set({
      recordedAudioBlobs: {},
      readingAnswers: {},
      writingSubmission: "",
      writingWordCount: 0,
      writingLastSavedAt: null,
      certificateUploaded: false,
      certificateDetails: null,
      isSubmitted: false,
    });
  },
}));

