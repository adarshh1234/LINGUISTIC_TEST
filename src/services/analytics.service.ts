import { MOCK_ANALYTICS_DATA } from "@/lib/mock-data/analytics.data";
import { assessmentService } from "./assessment.service";
import { candidateService } from "./candidate.service";
import { certificateService } from "./certificate.service";

export interface DashboardMetrics {
  totalAssessments: number;
  activeAssessments: number;
  completedAssessments: number;
  pendingAssessments: number;
  totalCandidates: number;
  averageLanguageScore: number;
  averageCEFRLevel: string;
  certificatesPendingVerification: number;
}

class AnalyticsService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const assessments = await assessmentService.getAssessments();
    const candidates = await candidateService.getCandidates();
    const certificates = await certificateService.getCertificates();

    const completedCandidates = candidates.filter((c) => c.status === "Completed" && c.scorecard);
    const avgScore = completedCandidates.length
      ? Math.round(completedCandidates.reduce((acc, c) => acc + (c.scorecard?.overallScore || 0), 0) / completedCandidates.length)
      : 84;

    const pendingCerts = certificates.filter(
      (c) => c.status === "Pending" || c.status === "Pending Manual Audit"
    ).length;

    return {
      totalAssessments: assessments.length,
      activeAssessments: assessments.filter((a) => a.status === "Active" || a.status === "Published").length,
      completedAssessments: assessments.filter((a) => a.status === "Completed").length,
      pendingAssessments: assessments.filter((a) => a.status === "Draft").length,
      totalCandidates: candidates.length,
      averageLanguageScore: avgScore,
      averageCEFRLevel: "C1",
      certificatesPendingVerification: pendingCerts,
    };
  }

  async getAnalyticsData() {
    return MOCK_ANALYTICS_DATA;
  }
}

export const analyticsService = new AnalyticsService();

