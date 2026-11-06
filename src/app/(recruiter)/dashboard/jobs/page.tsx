"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Users,
  FileCheck2,
  MapPin,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { jobService } from "@/services/job.service";
import { Job } from "@/types/job.types";
import { CEFRLevel } from "@/types/cefr.types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDepartment, setNewDepartment] = useState("Customer Experience");
  const [newLocation, setNewLocation] = useState("London, UK / Remote");
  const [newLang, setNewLang] = useState("English");
  const [newCefr, setNewCefr] = useState<CEFRLevel>("C1");
  const [newDescription, setNewDescription] = useState("");

  const loadJobs = async () => {
    const list = await jobService.getJobs();
    setJobs(list);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await jobService.createJob({
      title: newTitle,
      department: newDepartment,
      location: newLocation,
      employmentType: "Full-Time",
      status: "Active",
      description: newDescription || "High-performance multilingual position requiring fluent business communication.",
      requirements: [
        `CEFR ${newCefr} ${newLang} proficiency`,
        "Professional cross-cultural communication",
        "Executive presentation skills",
      ],
      requiredLanguages: [{ language: newLang, minCEFR: newCefr, isMandatory: true }],
      openingsCount: 2,
    });

    setIsCreateOpen(false);
    setNewTitle("");
    setNewDescription("");
    loadJobs();
  };

  const departments = ["All", ...Array.from(new Set(jobs.map((j) => j.department)))];

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || job.status === statusFilter;
    const matchDept = departmentFilter === "All" || job.department === departmentFilter;
    return matchSearch && matchStatus && matchDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Job Profiles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage target roles, language competency benchmarks, and candidate evaluations.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Job Position</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Search jobs by title or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-xs"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-6 font-medium">Job Title</th>
                  <th className="p-3.5 font-medium">Department</th>
                  <th className="p-3.5 font-medium">Location</th>
                  <th className="p-3.5 font-medium">Required Languages & CEFR</th>
                  <th className="p-3.5 font-medium">Candidates Assessed</th>
                  <th className="p-3.5 font-medium">Status</th>
                  <th className="p-3.5 pr-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No jobs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-6">
                        <Link href={`/dashboard/jobs/${job.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 block">
                          {job.title}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          {job.employmentType} · {job.openingsCount} openings
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{job.department}</td>
                      <td className="p-3.5 text-slate-500">
                        <div className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {job.requiredLanguages.map((req, i) => (
                            <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                              <span>{req.language}</span>
                              <CefrBadge level={req.minCEFR} />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-slate-900">{job.candidatesAssessedCount}</span>
                          <span className="text-slate-400">candidates</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <StatusPill status={job.status} />
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <Link href={`/dashboard/jobs/${job.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600">
                            Details →
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Job Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogClose onClose={() => setIsCreateOpen(false)} />
        <DialogHeader>
          <DialogTitle>Create New Job Position</DialogTitle>
          <DialogDescription>
            Define role requirements and mandatory CEFR language benchmarks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateJob} className="space-y-4 text-xs mt-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
            <Input
              placeholder="e.g. Bilingual Client Success Lead"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Department</label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-slate-700"
              >
                <option value="Customer Experience">Customer Experience</option>
                <option value="Engineering Support">Engineering Support</option>
                <option value="Corporate Communications">Corporate Communications</option>
                <option value="Operations">Operations</option>
                <option value="Revenue">Revenue</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Location</label>
              <Input
                placeholder="e.g. London / Remote"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Language</label>
              <select
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-slate-700"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Required Minimum CEFR</label>
              <select
                value={newCefr}
                onChange={(e) => setNewCefr(e.target.value as CEFRLevel)}
                className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-slate-700"
              >
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Proficient</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Job Description</label>
            <textarea
              rows={3}
              placeholder="Outline high-level responsibilities and linguistic expectations..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Job Record
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

