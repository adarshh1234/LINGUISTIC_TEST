import { CertificateRecord, CertificateVerificationStatus } from "@/types/certificate.types";
import { MOCK_CERTIFICATES } from "@/lib/mock-data/certificates.data";

const STORAGE_KEY = "verbalis_certificates";

class CertificateService {
  private getStored(): CertificateRecord[] {
    if (typeof window === "undefined") return MOCK_CERTIFICATES;
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CERTIFICATES));
      return MOCK_CERTIFICATES;
    }
    try {
      return JSON.parse(item);
    } catch {
      return MOCK_CERTIFICATES;
    }
  }

  private save(data: CertificateRecord[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async getCertificates(): Promise<CertificateRecord[]> {
    return this.getStored();
  }

  async getCertificateById(id: string): Promise<CertificateRecord | null> {
    const list = this.getStored();
    return list.find((c) => c.id === id) || null;
  }

  async uploadCertificate(data: Omit<CertificateRecord, "id" | "uploadedAt" | "status">): Promise<CertificateRecord> {
    const list = this.getStored();
    const newCert: CertificateRecord = {
      ...data,
      id: `cert-${Date.now().toString(36)}`,
      uploadedAt: new Date().toISOString(),
      status: "Pending Manual Audit",
      extractedData: {
        candidateNameMatched: true,
        providerConfirmed: true,
        bandScore: data.reportedScore,
        issueDateValid: true,
        tamperCheckPassed: true,
      },
    };
    list.unshift(newCert);
    this.save(list);
    return newCert;
  }

  async updateStatus(id: string, status: CertificateVerificationStatus, auditNotes?: string): Promise<CertificateRecord | null> {
    const list = this.getStored();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    list[idx] = {
      ...list[idx],
      status,
      auditNotes: auditNotes || list[idx].auditNotes,
      verifiedAt: status === "Verified" ? new Date().toISOString() : list[idx].verifiedAt,
    };
    this.save(list);
    return list[idx];
  }
}

export const certificateService = new CertificateService();

