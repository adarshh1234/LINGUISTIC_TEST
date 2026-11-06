export type IntegrityEventType =
  | "TAB_BLUR_DETECTED"
  | "CLIPBOARD_INTERCEPTED"
  | "MICROPHONE_DISCONNECT"
  | "UNUSUAL_PAUSE"
  | "NETWORK_DISCONNECTED"
  | "NETWORK_RECONNECTED"
  | "ASSESSMENT_RESTART";

export type IntegritySeverity = "LOW" | "MEDIUM" | "HIGH";

export interface IntegrityEvent {
  id: string;
  candidateId: string;
  candidateName: string;
  assessmentId: string;
  assessmentName: string;
  module: "Speaking" | "Reading" | "Writing" | "General";
  eventType: IntegrityEventType;
  severity: IntegritySeverity;
  timestamp: string;
  details: string;
  metadata?: Record<string, any>;
  isReviewed: boolean;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface IntegritySummary {
  totalEvents: number;
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
  candidatesRequiringReviewCount: number;
}

