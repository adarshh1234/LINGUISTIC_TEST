import { CertificateProvider } from "./assessment.types";

export type CertificateVerificationStatus =
  | "Pending"
  | "Verified"
  | "Failed"
  | "Pending Manual Audit";

export interface CertificateRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  provider: CertificateProvider;
  certificateNumber: string;
  testDate: string;
  reportedScore: string;
  overallBand: string;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  status: CertificateVerificationStatus;
  auditNotes?: string;
  verifiedAt?: string;
  extractedData?: {
    candidateNameMatched: boolean;
    providerConfirmed: boolean;
    bandScore: string;
    issueDateValid: boolean;
    tamperCheckPassed: boolean;
  };
}

