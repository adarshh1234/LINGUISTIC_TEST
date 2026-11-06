import { CEFRLevel } from "./cefr.types";

export interface JobLanguageRequirement {
  language: string;
  minCEFR: CEFRLevel;
  isMandatory: boolean;
}

export type JobStatus = "Active" | "Draft" | "Archived" | "Closed";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: "Full-Time" | "Part-Time" | "Contract" | "Remote";
  status: JobStatus;
  description: string;
  requirements: string[];
  requiredLanguages: JobLanguageRequirement[];
  linkedAssessmentIds: string[];
  candidatesAssessedCount: number;
  openingsCount: number;
  createdAt: string;
  updatedAt: string;
}

