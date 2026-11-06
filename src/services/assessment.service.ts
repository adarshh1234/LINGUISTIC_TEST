import { Assessment } from "@/types/assessment.types";
import { MOCK_ASSESSMENTS } from "@/lib/mock-data/assessments.data";

const STORAGE_KEY = "verbalis_assessments";

class AssessmentService {
  private getStored(): Assessment[] {
    if (typeof window === "undefined") return MOCK_ASSESSMENTS;
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ASSESSMENTS));
      return MOCK_ASSESSMENTS;
    }
    try {
      return JSON.parse(item);
    } catch {
      return MOCK_ASSESSMENTS;
    }
  }

  private save(data: Assessment[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async getAssessments(): Promise<Assessment[]> {
    return this.getStored();
  }

  async getAssessmentById(id: string): Promise<Assessment | null> {
    const list = this.getStored();
    return list.find((a) => a.id === id) || null;
  }

  async createAssessment(data: Omit<Assessment, "id" | "createdAt" | "updatedAt" | "candidatesInvitedCount" | "candidatesCompletedCount">): Promise<Assessment> {
    const list = this.getStored();
    const newAssessment: Assessment = {
      ...data,
      id: `asm-${Date.now().toString(36)}`,
      candidatesInvitedCount: 0,
      candidatesCompletedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newAssessment);
    this.save(list);
    return newAssessment;
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | null> {
    const list = this.getStored();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save(list);
    return list[idx];
  }

  async publishAssessment(id: string): Promise<Assessment | null> {
    return this.updateAssessment(id, { status: "Published" });
  }

  async archiveAssessment(id: string): Promise<Assessment | null> {
    return this.updateAssessment(id, { status: "Archived" });
  }

  async duplicateAssessment(id: string): Promise<Assessment | null> {
    const original = await this.getAssessmentById(id);
    if (!original) return null;
    const copy: Omit<Assessment, "id" | "createdAt" | "updatedAt" | "candidatesInvitedCount" | "candidatesCompletedCount"> = {
      ...original,
      name: `${original.name} (Copy)`,
      status: "Draft",
    };
    return this.createAssessment(copy);
  }
}

export const assessmentService = new AssessmentService();

