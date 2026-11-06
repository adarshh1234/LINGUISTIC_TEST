"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brandingService } from "@/services/branding.service";

export default function CandidateLoginPage() {
  const router = useRouter();
  const branding = brandingService.getBranding();
  const [accessCode, setAccessCode] = useState("VERBALIS-C1-2026");
  const [email, setEmail] = useState("elena.rostova@example.com");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/candidate");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white mx-auto shadow-lg shadow-indigo-500/20">
            {branding.organizationName.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{branding.organizationName}</h2>
          <p className="text-xs text-slate-400">Linguistic Proficiency Assessment Portal</p>
        </div>

        {/* Card */}
        <Card className="border-slate-800 bg-slate-850/90 bg-slate-800/80 backdrop-blur text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-base">Candidate Assessment Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your invitation email or 8-digit assessment access code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Candidate Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Assessment Invitation Code</label>
                <div className="relative">
                  <Input
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="bg-slate-900/60 border-slate-700 text-white font-mono uppercase"
                    placeholder="e.g. ASMT-8842"
                    required
                  />
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <Link href="/forgot-password" className="text-indigo-400 hover:underline">
                  Need help accessing your test?
                </Link>
                <Link href="/register" className="text-slate-400 hover:text-white">
                  New registration
                </Link>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 shadow-sm mt-2">
                <span>Access Linguistic Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recruiter Switcher Link */}
        <div className="text-center text-xs text-slate-500">
          Recruiter or Hiring Manager?{" "}
          <Link href="/dashboard" className="text-indigo-400 hover:underline font-semibold">
            Go to Recruiter Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}

