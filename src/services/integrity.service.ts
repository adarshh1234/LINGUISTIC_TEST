import { IntegrityEvent, IntegritySummary } from "@/types/integrity.types";
import { MOCK_INTEGRITY_EVENTS } from "@/lib/mock-data/integrity.data";

const STORAGE_KEY = "verbalis_integrity_events";

class IntegrityService {
  private getStored(): IntegrityEvent[] {
    if (typeof window === "undefined") return MOCK_INTEGRITY_EVENTS;
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INTEGRITY_EVENTS));
      return MOCK_INTEGRITY_EVENTS;
    }
    try {
      return JSON.parse(item);
    } catch {
      return MOCK_INTEGRITY_EVENTS;
    }
  }

  private save(data: IntegrityEvent[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async getEvents(): Promise<IntegrityEvent[]> {
    return this.getStored();
  }

  async getEventsByCandidateId(candidateId: string): Promise<IntegrityEvent[]> {
    const events = this.getStored();
    return events.filter((e) => e.candidateId === candidateId);
  }

  async getSummary(): Promise<IntegritySummary> {
    const events = this.getStored();
    const candidateIdsWithReview = new Set(
      events.filter((e) => !e.isReviewed && (e.severity === "HIGH" || e.severity === "MEDIUM")).map((e) => e.candidateId)
    );

    return {
      totalEvents: events.length,
      highSeverityCount: events.filter((e) => e.severity === "HIGH").length,
      mediumSeverityCount: events.filter((e) => e.severity === "MEDIUM").length,
      lowSeverityCount: events.filter((e) => e.severity === "LOW").length,
      candidatesRequiringReviewCount: candidateIdsWithReview.size,
    };
  }

  async markEventReviewed(id: string, notes: string, reviewerName: string = "Talent Lead"): Promise<IntegrityEvent | null> {
    const events = this.getStored();
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    events[idx] = {
      ...events[idx],
      isReviewed: true,
      reviewNotes: notes,
      reviewedBy: reviewerName,
    };
    this.save(events);
    return events[idx];
  }

  async logEvent(event: Omit<IntegrityEvent, "id" | "timestamp" | "isReviewed">): Promise<IntegrityEvent> {
    const events = this.getStored();
    const newEvent: IntegrityEvent = {
      ...event,
      id: `integ-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      isReviewed: false,
    };
    events.unshift(newEvent);
    this.save(events);
    return newEvent;
  }
}

export const integrityService = new IntegrityService();

