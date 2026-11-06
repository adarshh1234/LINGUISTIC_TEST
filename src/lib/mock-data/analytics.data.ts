export interface CompletionTrendPoint {
  month: string;
  invited: number;
  completed: number;
  completionRate: number;
}

export interface CefrDistributionPoint {
  level: string;
  count: number;
  percentage: number;
  fill: string;
}

export interface LanguageDistributionPoint {
  language: string;
  candidateCount: number;
  averageScore: number;
  benchmarkMetRate: number;
}

export interface SkillComparisonPoint {
  skill: string;
  speaking: number;
  reading: number;
  writing: number;
}

export const MOCK_ANALYTICS_DATA = {
  completionTrends: [
    { month: "May", invited: 28, completed: 22, completionRate: 78.5 },
    { month: "Jun", invited: 35, completed: 30, completionRate: 85.7 },
    { month: "Jul", invited: 42, completed: 36, completionRate: 85.7 },
    { month: "Aug", invited: 50, completed: 44, completionRate: 88.0 },
    { month: "Sep", invited: 64, completed: 58, completionRate: 90.6 },
    { month: "Oct", invited: 78, completed: 69, completionRate: 88.4 },
    { month: "Nov", invited: 45, completed: 38, completionRate: 84.4 },
  ],
  cefrDistribution: [
    { level: "A1 (Beginner)", count: 2, percentage: 1.5, fill: "#94a3b8" },
    { level: "A2 (Elementary)", count: 8, percentage: 6.2, fill: "#60a5fa" },
    { level: "B1 (Intermediate)", count: 24, percentage: 18.5, fill: "#38bdf8" },
    { level: "B2 (Upper Int)", count: 48, percentage: 36.9, fill: "#818cf8" },
    { level: "C1 (Advanced)", count: 38, percentage: 29.2, fill: "#34d399" },
    { level: "C2 (Proficient)", count: 10, percentage: 7.7, fill: "#c084fc" },
  ],
  languageDistribution: [
    { language: "English", candidateCount: 68, averageScore: 84.2, benchmarkMetRate: 86.7 },
    { language: "Spanish", candidateCount: 32, averageScore: 81.5, benchmarkMetRate: 81.2 },
    { language: "Japanese", candidateCount: 18, averageScore: 86.8, benchmarkMetRate: 88.8 },
    { language: "German", candidateCount: 14, averageScore: 89.4, benchmarkMetRate: 92.8 },
    { language: "French", candidateCount: 12, averageScore: 82.0, benchmarkMetRate: 83.3 },
  ],
  skillScoresOverTime: [
    { month: "Jun", speaking: 76, reading: 82, writing: 74, overall: 77 },
    { month: "Jul", speaking: 78, reading: 83, writing: 76, overall: 79 },
    { month: "Aug", speaking: 81, reading: 85, writing: 79, overall: 82 },
    { month: "Sep", speaking: 83, reading: 86, writing: 81, overall: 83 },
    { month: "Oct", speaking: 85, reading: 88, writing: 82, overall: 85 },
    { month: "Nov", speaking: 84, reading: 87, writing: 83, overall: 85 },
  ],
  wpmDistribution: [
    { range: "<100 WPM (Hesitant)", count: 12, color: "#f59e0b" },
    { range: "100-120 WPM (Deliberate)", count: 28, color: "#10b981" },
    { range: "120-145 WPM (Optimal)", count: 54, color: "#6366f1" },
    { range: "145-165 WPM (Fluent)", count: 26, color: "#3b82f6" },
    { range: ">165 WPM (Fast / Urgent)", count: 10, color: "#8b5cf6" },
  ],
  integrityStats: {
    cleanCount: 112,
    lowRiskCount: 12,
    mediumRiskCount: 4,
    highRiskCount: 2,
  },
};

