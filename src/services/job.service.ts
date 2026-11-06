import { Job } from "@/types/job.types";
import { MOCK_JOBS } from "@/lib/mock-data/jobs.data";

const STORAGE_KEY = "verbalis_jobs";

class JobService {
  private getStoredJobs(): Job[] {
    if (typeof window === "undefined") return MOCK_JOBS;
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_JOBS));
      return MOCK_JOBS;
    }
    try {
      return JSON.parse(item);
    } catch {
      return MOCK_JOBS;
    }
  }

  private saveJobs(jobs: Job[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }

  async getJobs(): Promise<Job[]> {
    return this.getStoredJobs();
  }

  async getJobById(id: string): Promise<Job | null> {
    const jobs = this.getStoredJobs();
    return jobs.find((j) => j.id === id) || null;
  }

  async createJob(data: Omit<Job, "id" | "createdAt" | "updatedAt" | "candidatesAssessedCount" | "linkedAssessmentIds">): Promise<Job> {
    const jobs = this.getStoredJobs();
    const newJob: Job = {
      ...data,
      id: `job-${Date.now().toString(36)}`,
      candidatesAssessedCount: 0,
      linkedAssessmentIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jobs.unshift(newJob);
    this.saveJobs(jobs);
    return newJob;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
    const jobs = this.getStoredJobs();
    const index = jobs.findIndex((j) => j.id === id);
    if (index === -1) return null;
    jobs[index] = { ...jobs[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveJobs(jobs);
    return jobs[index];
  }
}

export const jobService = new JobService();

