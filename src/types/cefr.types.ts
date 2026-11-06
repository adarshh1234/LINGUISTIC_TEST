export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface CEFRLevelInfo {
  level: CEFRLevel;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  badgeColor: string;
}

export const CEFR_LEVELS_INFO: Record<CEFRLevel, CEFRLevelInfo> = {
  A1: {
    level: "A1",
    name: "Beginner",
    description: "Can understand and use familiar everyday expressions and very basic phrases.",
    minScore: 0,
    maxScore: 29,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
  },
  A2: {
    level: "A2",
    name: "Elementary",
    description: "Can communicate in simple and routine tasks requiring simple exchange of information.",
    minScore: 30,
    maxScore: 49,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  B1: {
    level: "B1",
    name: "Intermediate",
    description: "Can deal with most situations likely to arise whilst travelling or in standard workplace conversations.",
    minScore: 50,
    maxScore: 69,
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  B2: {
    level: "B2",
    name: "Upper Intermediate",
    description: "Can interact with a degree of fluency and spontaneity with native speakers without strain.",
    minScore: 70,
    maxScore: 84,
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  C1: {
    level: "C1",
    name: "Advanced",
    description: "Can express ideas fluently and spontaneously without much obvious searching for expressions.",
    minScore: 85,
    maxScore: 94,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  C2: {
    level: "C2",
    name: "Proficient",
    description: "Can understand with ease virtually everything heard or read; summarizes information effortlessly.",
    minScore: 95,
    maxScore: 100,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

export type WpmClassification = "SLOW_OR_HESITANT" | "MODERATE" | "FAST_OR_URGENT";

export function getWpmClassification(wpm: number): {
  classification: WpmClassification;
  label: string;
  color: string;
} {
  if (wpm < 110) {
    return {
      classification: "SLOW_OR_HESITANT",
      label: "Slow / Hesitant (<110 WPM)",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    };
  } else if (wpm <= 160) {
    return {
      classification: "MODERATE",
      label: "Moderate (110–160 WPM)",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  } else {
    return {
      classification: "FAST_OR_URGENT",
      label: "Fast / Urgent (>160 WPM)",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }
}

