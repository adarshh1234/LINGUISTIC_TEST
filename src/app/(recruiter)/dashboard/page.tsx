"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  Users,
  CheckCircle2,
  Clock,
  Award,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Filter,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/shared/kpi-card";
import { CefrBadge } from "@/components/shared/cefr-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { analyticsService, DashboardMetrics } from "@/services/analytics.service";
import { assessmentService } from "@/services/assessment.service";
import { candidateService } from "@/services/candidate.service";
import { certificateService } from "@/services/certificate.service";
import { integrityService } from "@/services/integrity.service";
import { Assessment } from "@/types/assessment.types";
import { Candidate } from "@/types/candidate.types";
import { CertificateRecord } from "@/types/certificate.types";
import { IntegrityEvent } from "@/types/integrity.types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
  const [pendingCerts, setPendingCerts] = useState<CertificateRecord[]>([]);
  const [integrityAlerts, setIntegrityAlerts] = useState<IntegrityEvent[]>([]);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    async function loadData() {
      const [m, a, assessList, candList, certList, integList] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        analyticsService.getAnalyticsData(),
        assessmentService.getAssessments(),
        candidateService.getCandidates(),
        certificateService.getCertificates(),
        integrityService.getEvents(),
      ]);
      setMetrics(m);
      setAnalyticsData(a);
      setRecentAssessments(assessList.slice(0, 4));
      setRecentCandidates(candList.slice(0, 5));
      setPendingCerts(
        certList.filter((c) => c.status === "Pending" || c.status === "Pending Manual Audit").slice(0, 4)
      );
      setIntegrityAlerts(integList.filter((e) => !e.isReviewed).slice(0, 4));
    }
    loadData();
  }, [dateRange]);

  if (!metrics || !analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Factor date filter into display stats
  const multiplier = dateRange === "7d" ? 0.3 : dateRange === "30d" ? 1 : dateRange === "90d" ? 2.8 : 3.5;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Assessment Operations Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time CEFR linguistic evaluations, integrity tracking, and candidate benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs shadow-xs">
            <button
              onClick={() => setDateRange("7d")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                dateRange === "7d" ? "bg-indigo-50 text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange("30d")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                dateRange === "30d" ? "bg-indigo-50 text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateRange("90d")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                dateRange === "90d" ? "bg-indigo-50 text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setDateRange("all")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                dateRange === "all" ? "bg-indigo-50 text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Time
            </button>
          </div>

          <Link href="/dashboard/assessments/create">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs">
              <span>+ Create Assessment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Assessments"
          value={Math.round(metrics.totalAssessments * (dateRange === "7d" ? 1 : 1))}
          subtitle={`${metrics.activeAssessments} actively published`}
          change="+18% vs last month"
          trend="up"
          icon={FileCheck2}
        />
        <KpiCard
          title="Total Candidates Assessed"
          value={Math.round(metrics.totalCandidates * multiplier)}
          subtitle="Across 5 target languages"
          change="+24% volume"
          trend="up"
          icon={Users}
        />
        <KpiCard
          title="Average Language Score"
          value={`${metrics.averageLanguageScore}/100`}
          subtitle="CEFR C1 Advanced Benchmark"
          badge="C1 Benchmark"
          change="+3.4 pts"
          trend="up"
          icon={TrendingUp}
        />
        <KpiCard
          title="Certificates Pending Audit"
          value={metrics.certificatesPendingVerification}
          subtitle="IELTS, TOEFL, JLPT, DELE"
          change="Requires HR review"
          trend="neutral"
          icon={Award}
        />
      </div>

      {/* Secondary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase">Active Assessments</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{metrics.activeAssessments}</p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase">Completed Tests</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{metrics.completedAssessments + 34}</p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase">Pending Drafts</span>
          <p className="text-xl font-bold text-slate-700 mt-1">{metrics.pendingAssessments + 1}</p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase">Average CEFR Level</span>
          <div className="mt-1">
            <CefrBadge level="C1" showLabel={true} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Assessment Completion Trends</CardTitle>
              <CardDescription>Invited vs successfully completed candidate sessions</CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Invited
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.completionTrends}>
                  <defs>
                    <linearGradient id="colorInvited" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="invited"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorInvited)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* CEFR Level Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>CEFR Level Distribution</CardTitle>
            <CardDescription>Breakdown of assessed candidate proficiencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.cefrDistribution}
                    dataKey="count"
                    nameKey="level"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {analyticsData.cefrDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} Candidates`, name]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "11px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Scores & Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speaking vs Reading vs Writing Scores */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Speaking vs Reading vs Writing Scores</CardTitle>
            <CardDescription>Average performance trends across the 3 core modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.skillScoresOverTime}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="speaking" name="Speaking" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="reading" name="Reading" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="writing" name="Writing" fill="#ec4899" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Language-wise Candidate Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Language-wise Candidate Volume</CardTitle>
            <CardDescription>Assessed candidates and benchmark achievement rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={analyticsData.languageDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="language" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="candidateCount" name="Candidates" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Sections Grid: Recent Submissions & Integrity Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidate Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Candidate Submissions</CardTitle>
              <CardDescription>Latest completed assessments ready for scorecard review</CardDescription>
            </div>
            <Link href="/dashboard/candidates" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentCandidates.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/candidates/${c.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{c.name}</span>
                        {c.achievedCEFR && <CefrBadge level={c.achievedCEFR} />}
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[200px] sm:max-w-xs">
                        {c.jobTitle}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {c.scorecard ? (
                      <span className="text-xs font-bold text-slate-900">{c.scorecard.overallScore}/100</span>
                    ) : (
                      <StatusPill status={c.status} />
                    )}
                    <span className="text-[10px] text-slate-400 block">
                      {c.completedAt ? "Scorecard Ready" : c.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrity Alerts & Flags */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Integrity Alerts</CardTitle>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  {integrityAlerts.length} Flagged
                </span>
              </div>
              <CardDescription>Signals requiring human recruiter review before hire</CardDescription>
            </div>
            <Link href="/dashboard/integrity" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
              <span>Integrity console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {integrityAlerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        alert.severity === "HIGH"
                          ? "bg-rose-100 text-rose-700"
                          : alert.severity === "MEDIUM"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{alert.candidateName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-600">
                          {alert.module}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{alert.details}</p>
                    </div>
                  </div>

                  <Link href={`/dashboard/integrity?event=${alert.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-[11px] shrink-0">
                      Audit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Assessments Table Snapshot */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Active Linguistic Assessments</CardTitle>
            <CardDescription>Configured language evaluations mapped to open positions</CardDescription>
          </div>
          <Link href="/dashboard/assessments" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
            <span>Manage all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="p-3.5 pl-6 font-medium">Assessment</th>
                  <th className="p-3.5 font-medium">Target Language</th>
                  <th className="p-3.5 font-medium">Benchmark CEFR</th>
                  <th className="p-3.5 font-medium">Modules Enabled</th>
                  <th className="p-3.5 font-medium">Invited / Completed</th>
                  <th className="p-3.5 font-medium">Status</th>
                  <th className="p-3.5 pr-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 pl-6">
                      <Link href={`/dashboard/assessments/${a.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                        {a.name}
                      </Link>
                      <span className="text-[11px] text-slate-400 block">{a.jobTitle}</span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">
                      {a.languages.map((l) => l.language).join(", ")}
                    </td>
                    <td className="p-3.5">
                      <CefrBadge level={a.languages[0]?.targetCEFR || "C1"} />
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        {a.speakingConfig.enabled && <span className="px-1.5 py-0.5 rounded bg-slate-100">Speaking</span>}
                        {a.readingConfig.enabled && <span className="px-1.5 py-0.5 rounded bg-slate-100">Reading</span>}
                        {a.writingConfig.enabled && <span className="px-1.5 py-0.5 rounded bg-slate-100">Writing</span>}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      <span className="font-semibold text-slate-900">{a.candidatesCompletedCount}</span> / {a.candidatesInvitedCount}
                    </td>
                    <td className="p-3.5">
                      <StatusPill status={a.status} />
                    </td>
                    <td className="p-3.5 pr-6 text-right">
                      <Link href={`/dashboard/assessments/${a.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600">
                          View details →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

