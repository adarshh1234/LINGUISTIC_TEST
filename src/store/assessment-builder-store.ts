import { create } from "zustand";
import { Assessment, SpeakingConfig, ReadingConfig, WritingConfig, CertificateConfig, IntegrityConfig, ConsentConfig, LanguageTargetConfig, ModuleWeights } from "@/types/assessment.types";
import { assessmentService } from "@/services/assessment.service";

interface AssessmentBuilderState {
  currentStep: number;
  totalSteps: number;
  isSaving: boolean;
  isValid: boolean;
  validationError: string | null;

  // Form Fields
  name: string;
  jobId: string;
  jobTitle: string;
  industry: string;
  jobDescription: string;
  assessmentDescription: string;
  nativeLanguage: string;
  languages: LanguageTargetConfig[];
  weights: ModuleWeights;
  speakingConfig: SpeakingConfig;
  readingConfig: ReadingConfig;
  writingConfig: WritingConfig;
  certificateConfig: CertificateConfig;
  integrityConfig: IntegrityConfig;
  consentConfig: ConsentConfig;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  updateField: (field: string, value: any) => void;
  setWeights: (weights: ModuleWeights) => void;
  validateStep: (step: number) => boolean;
  resetBuilder: () => void;
  saveDraft: () => Promise<Assessment | null>;
  publish: () => Promise<Assessment | null>;
}

const INITIAL_STATE = {
  currentStep: 1,
  totalSteps: 10,
  isSaving: false,
  isValid: true,
  validationError: null,

  name: "Global Multilingual Assessment Benchmark",
  jobId: "job-001",
  jobTitle: "Global Enterprise Customer Success Lead",
  industry: "Enterprise SaaS & Technology",
  jobDescription: "Evaluating high-stakes executive verbal communication, conflict de-escalation, and professional email correspondence.",
  assessmentDescription: "Standard 45-minute linguistic assessment evaluating spoken fluency, nuanced comprehension, and business writing.",
  nativeLanguage: "English",
  languages: [
    { language: "English", targetCEFR: "C1" as const, isPrimary: true },
    { language: "French", targetCEFR: "B2" as const, isPrimary: false },
  ],
  weights: {
    speakingWeight: 50,
    readingWeight: 20,
    writingWeight: 30,
  },
  speakingConfig: {
    enabled: true,
    mode: "STRUCTURED_PROMPT" as const,
    prepTimeSeconds: 45,
    recordingDurationSeconds: 120,
    maxAttempts: 2,
    evaluationCriteria: {
      pronunciation: true,
      grammar: true,
      vocabulary: true,
      fluency: true,
      coherence: true,
      comprehension: true,
      responseRelevance: true,
    },
    questions: [
      {
        id: "spk-new-1",
        order: 1,
        title: "Executive Outage De-escalation Briefing",
        scenario: "You are speaking to a critical enterprise partner CTO following a service interruption during peak transaction hours.",
        prepTimeSeconds: 45,
        recordTimeSeconds: 120,
        hints: ["Acknowledge disruption", "State remediation steps", "Offer direct executive review"],
      },
    ],
  },
  readingConfig: {
    enabled: true,
    durationMinutes: 15,
    targetCEFR: "C1" as const,
    passageType: "Enterprise Service Level Agreements & Technical Whitepapers",
    passages: [],
  },
  writingConfig: {
    enabled: true,
    taskType: "PROFESSIONAL_EMAIL" as const,
    durationMinutes: 20,
    minWordCount: 150,
    maxWordCount: 350,
    characterLimit: 2500,
    restrictCopyPaste: true,
    task: {
      id: "wrt-new-1",
      title: "Executive Escalation Response Memo",
      taskType: "PROFESSIONAL_EMAIL" as const,
      instructions: "Compose a formal executive email addressing client stakeholders regarding the service recovery plan.",
      scenarioContext: "Yesterday between 14:15 and 15:00 UTC, a database failover misconfiguration caused transaction timeouts.",
      prompt: "Draft an executive email explaining the root cause and long-term mitigation actions.",
      minWordCount: 150,
      maxWordCount: 350,
      timeLimitMinutes: 20,
      allowCopyPaste: false,
    },
  },
  certificateConfig: {
    requirement: "OPTIONAL" as const,
    acceptedProviders: ["IELTS", "TOEFL", "GRE", "JLPT", "DELE", "OTHER"] as any[],
  },
  integrityConfig: {
    tabSwitchingDetection: true,
    copyDetection: true,
    pasteDetection: true,
    fullscreenMonitoring: true,
    unusualPauseDetection: true,
    microphoneDisconnectDetection: true,
    networkInterruptionMonitoring: true,
  },
  consentConfig: {
    audioRecordingConsent: true,
    aiLanguageEvaluationConsent: true,
    dataProcessingConsent: true,
    retentionMonths: 12,
    privacyNoticeText: "Audio and written records are processed strictly for candidate proficiency evaluation under enterprise GDPR & SOC2 standards.",
  },
};

export const useAssessmentBuilderStore = create<AssessmentBuilderState>((set, get) => ({
  ...INITIAL_STATE,

  setStep: (step: number) => {
    if (step >= 1 && step <= get().totalSteps) {
      set({ currentStep: step, validationError: null });
    }
  },

  nextStep: () => {
    const current = get().currentStep;
    if (!get().validateStep(current)) {
      return false;
    }
    if (current < get().totalSteps) {
      set({ currentStep: current + 1, validationError: null });
      return true;
    }
    return true;
  },

  prevStep: () => {
    const current = get().currentStep;
    if (current > 1) {
      set({ currentStep: current - 1, validationError: null });
    }
  },

  updateField: (field: string, value: any) => {
    set((state) => ({
      ...state,
      [field]: value,
      validationError: null,
    }));
  },

  setWeights: (weights: ModuleWeights) => {
    set({ weights });
  },

  validateStep: (step: number): boolean => {
    const state = get();
    if (step === 1) {
      if (!state.name.trim()) {
        set({ validationError: "Assessment name is required." });
        return false;
      }
      if (!state.jobTitle.trim()) {
        set({ validationError: "Job title is required." });
        return false;
      }
    } else if (step === 2) {
      if (!state.languages || state.languages.length === 0) {
        set({ validationError: "At least one target language must be configured." });
        return false;
      }
    } else if (step === 3) {
      // Validate module weights equal 100%
      let total = 0;
      if (state.speakingConfig.enabled) total += state.weights.speakingWeight;
      if (state.readingConfig.enabled) total += state.weights.readingWeight;
      if (state.writingConfig.enabled) total += state.weights.writingWeight;

      if (total !== 100) {
        set({ validationError: `Module weights must total exactly 100%. Current total: ${total}%.` });
        return false;
      }
    }
    set({ validationError: null });
    return true;
  },

  resetBuilder: () => {
    set({ ...INITIAL_STATE });
  },

  saveDraft: async () => {
    set({ isSaving: true });
    try {
      const state = get();
      const payload = {
        name: state.name,
        jobId: state.jobId,
        jobTitle: state.jobTitle,
        industry: state.industry,
        jobDescription: state.jobDescription,
        assessmentDescription: state.assessmentDescription,
        status: "Draft" as const,
        nativeLanguage: state.nativeLanguage,
        languages: state.languages,
        weights: state.weights,
        speakingConfig: state.speakingConfig,
        readingConfig: state.readingConfig,
        writingConfig: state.writingConfig,
        certificateConfig: state.certificateConfig,
        integrityConfig: state.integrityConfig,
        consentConfig: state.consentConfig,
      };
      const res = await assessmentService.createAssessment(payload);
      return res;
    } finally {
      set({ isSaving: false });
    }
  },

  publish: async () => {
    if (!get().validateStep(3)) {
      return null;
    }
    set({ isSaving: true });
    try {
      const state = get();
      const payload = {
        name: state.name,
        jobId: state.jobId,
        jobTitle: state.jobTitle,
        industry: state.industry,
        jobDescription: state.jobDescription,
        assessmentDescription: state.assessmentDescription,
        status: "Published" as const,
        nativeLanguage: state.nativeLanguage,
        languages: state.languages,
        weights: state.weights,
        speakingConfig: state.speakingConfig,
        readingConfig: state.readingConfig,
        writingConfig: state.writingConfig,
        certificateConfig: state.certificateConfig,
        integrityConfig: state.integrityConfig,
        consentConfig: state.consentConfig,
      };
      const res = await assessmentService.createAssessment(payload);
      return res;
    } finally {
      set({ isSaving: false });
    }
  },
}));

