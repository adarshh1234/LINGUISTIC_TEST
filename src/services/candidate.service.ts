import { Candidate } from "@/types/candidate.types";
import { MOCK_CANDIDATES } from "@/lib/mock-data/candidates.data";

const STORAGE_KEY = "verbalis_candidates";

class CandidateService {
  private getStored(): Candidate[] {
    if (typeof window === "undefined") return MOCK_CANDIDATES;
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CANDIDATES));
      return MOCK_CANDIDATES;
    }
    try {
      return JSON.parse(item);
    } catch {
      return MOCK_CANDIDATES;
    }
  }

  private save(data: Candidate[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async getCandidates(): Promise<Candidate[]> {
    return this.getStored();
  }

  async getCandidateById(id: string): Promise<Candidate | null> {
    const list = this.getStored();
    return list.find((c) => c.id === id) || null;
  }

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate | null> {
    const list = this.getStored();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.save(list);
    return list[idx];
  }
}

export const candidateService = new CandidateService();

