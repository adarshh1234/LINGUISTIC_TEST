"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  RotateCcw,
  Save,
  Check,
  Eye,
  Sparkles,
  Globe2,
  Mic,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brandingService } from "@/services/branding.service";
import { WhiteLabelBranding, DEFAULT_BRANDING } from "@/types/branding.types";

export default function BrandingSettingsPage() {
  const [branding, setBranding] = useState<WhiteLabelBranding>(DEFAULT_BRANDING);
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    const current = brandingService.getBranding();
    setBranding(current);
  }, []);

  const handleSave = () => {
    brandingService.saveBranding(branding);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleReset = () => {
    const reset = brandingService.resetToDefaults();
    setBranding(reset);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Branding configuration updated! Changes reflected in candidate assessment portal.
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            White-Label & Enterprise Branding
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize candidate assessment portal styling, organization typography, logos, and candidate welcome notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs text-slate-600">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs">
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>

      {/* 2-Column Layout: Form Settings & Live Candidate Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Identity</CardTitle>
              <CardDescription>Primary company identifiers visible to candidates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Organization Name</label>
                <Input
                  value={branding.organizationName}
                  onChange={(e) => setBranding({ ...branding, organizationName: e.target.value })}
                  placeholder="e.g. GlobalTalent Corp"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company Support Email</label>
                <Input
                  value={branding.supportEmail}
                  onChange={(e) => setBranding({ ...branding, supportEmail: e.target.value })}
                  placeholder="e.g. talent@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Primary Brand Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <Input
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Secondary Brand Tone</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <Input
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Candidate Welcome Experience</CardTitle>
              <CardDescription>Introductory text displayed when candidates launch their session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Candidate Greeting Message</label>
                <textarea
                  rows={3}
                  value={branding.welcomeMessage}
                  onChange={(e) => setBranding({ ...branding, welcomeMessage: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assessment Guidance Text</label>
                <textarea
                  rows={3}
                  value={branding.candidateInstructions}
                  onChange={(e) => setBranding({ ...branding, candidateInstructions: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Candidate Portal Preview */}
        <div>
          <Card className="overflow-hidden border-2 border-indigo-100 shadow-md">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold">Live Candidate Assessment Preview</span>
              </div>
              <span className="text-[10px] text-slate-400">Desktop Simulation</span>
            </div>

            {/* Simulated Candidate Window */}
            <div className="p-6 bg-slate-50 space-y-6">
              {/* Simulated Candidate Header */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {branding.organizationName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      {branding.organizationName}
                    </span>
                    <span className="text-[10px] text-slate-500">Language Proficiency Gateway</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Mic Ready
                  </span>
                </div>
              </div>

              {/* Simulated Assessment Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                    CEFR C1 Linguistic Evaluation
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {branding.welcomeMessage}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {branding.candidateInstructions}
                </p>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <span className="font-semibold text-slate-800 block">Session Requirements:</span>
                  <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                    <Mic className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Working microphone for speaking modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Standard proctoring & focus monitoring enabled</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 rounded-lg text-white font-semibold text-xs shadow-sm transition-opacity hover:opacity-95"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  Start Assessment Experience →
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400">
                Support inquiries: <span className="text-slate-600">{branding.supportEmail}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

