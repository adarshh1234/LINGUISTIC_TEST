"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  Layers,
  Award,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_ANALYTICS_DATA } from "@/lib/mock-data/analytics.data";
import { exportToCsv } from "@/lib/utils";
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
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [selectedLang, setSelectedLang] = useState("All");

  const handleExportData = () => {
    const exportRows = MOCK_ANALYTICS_DATA.completionTrends.map((t) => ({
      Month: t.month,
      "Candidates Invited": t.invited,
      "Candidates Completed": t.completed,
      "Completion Rate %": t.completionRate,
    }));
    exportToCsv("linguistic_assessment_analytics", exportRows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics & Linguistic Insights
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise language proficiency metrics, CEFR benchmarks, and proctoring telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90d)</option>
            <option value="all">All Time</option>
          </select>

          <Button onClick={handleExportData} variant="outline" size="sm" className="gap-1.5 text-xs text-slate-700">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Analytics</span>
          </Button>
        </div>
      </div>

      {/* Primary Charts Row: Completion Trends & CEFR Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>1. Assessment Completion Trends</CardTitle>
            <CardDescription>Invited candidates vs successfully completed sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_ANALYTICS_DATA.completionTrends}>
                  <defs>
                    <linearGradient id="anColorInv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="anColorComp" x1="0" y1="0" x2="0" y2="1">
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
                      fontSize: "11px",
                    }}
                  />
                  <Area type="monotone" dataKey="invited" name="Invited" stroke="#6366f1" strokeWidth={2} fill="url(#anColorInv)" />
                  <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} fill="url(#anColorComp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. CEFR Level Distribution</CardTitle>
            <CardDescription>Candidate distribution across A1–C2 tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_ANALYTICS_DATA.cefrDistribution}
                    dataKey="count"
                    nameKey="level"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {MOCK_ANALYTICS_DATA.cefrDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "11px",
                    }}
                  />
                  <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Language Distribution & Module Score Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>3. Language Distribution & Benchmarks</CardTitle>
            <CardDescription>Candidate volumes and benchmark pass rates by language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_ANALYTICS_DATA.languageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="language" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="candidateCount" name="Candidates" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="averageScore" name="Avg Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Speaking, Reading & Writing Score Trajectories</CardTitle>
            <CardDescription>Monthly benchmark averages across the 3 core modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_ANALYTICS_DATA.skillScoresOverTime}>
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
                  <Line type="monotone" dataKey="speaking" name="Speaking" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="reading" name="Reading" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="writing" name="Writing" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row: Words Per Minute Distribution & Integrity Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>5. Speaking Pacing & WPM Distribution</CardTitle>
            <CardDescription>Speech velocity classification across candidate tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_ANALYTICS_DATA.wpmDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="count" name="Candidate Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Assessment Integrity Event Distribution</CardTitle>
            <CardDescription>Breakdown of proctoring risk classifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <span className="font-semibold text-emerald-800">Clean Sessions (No Violations)</span>
                <span className="font-bold text-emerald-900 text-base">{MOCK_ANALYTICS_DATA.integrityStats.cleanCount} candidates</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs">
                <span className="font-semibold text-blue-800">Low Risk (Minor Mic Drops / Brief Blurs)</span>
                <span className="font-bold text-blue-900 text-base">{MOCK_ANALYTICS_DATA.integrityStats.lowRiskCount} candidates</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                <span className="font-semibold text-amber-800">Medium Risk (Extended Focus Losses)</span>
                <span className="font-bold text-amber-900 text-base">{MOCK_ANALYTICS_DATA.integrityStats.mediumRiskCount} candidates</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                <span className="font-semibold text-rose-800">High Risk (Repeated Paste Attempts / Restarts)</span>
                <span className="font-bold text-rose-900 text-base">{MOCK_ANALYTICS_DATA.integrityStats.highRiskCount} candidates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

