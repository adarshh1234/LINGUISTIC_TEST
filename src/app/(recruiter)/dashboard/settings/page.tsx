"use client";

import React, { useState } from "react";
import {
  Settings,
  Building,
  User,
  Shield,
  Trash2,
  Check,
  AlertCircle,
  Lock,
  Globe,
  Sliders,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");
  const [savedBanner, setSavedBanner] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleDeleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteEmail.trim()) return;
    setDeleteSuccess(true);
    setTimeout(() => {
      setDeleteSuccess(false);
      setIsDeleteModalOpen(false);
      setDeleteEmail("");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Organization preferences, compliance consent policies, and candidate data deletion workflows.
        </p>
      </div>

      {savedBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="organization">Organization Profile</TabsTrigger>
          <TabsTrigger value="defaults">Assessment Defaults</TabsTrigger>
          <TabsTrigger value="compliance">Consent & Data Retention</TabsTrigger>
          <TabsTrigger value="deletion">Candidate Data Deletion</TabsTrigger>
        </TabsList>

        {/* TAB 1: ORGANIZATION PROFILE */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Corporate tenant profile and admin contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Company Legal Name</label>
                    <Input defaultValue="GlobalTalent Technologies Ltd." />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Primary Recruiter Contact</label>
                    <Input defaultValue="Sarah Jenkins" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Admin Email</label>
                    <Input defaultValue="admin@globaltalent.io" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">HQ Timezone</label>
                    <select className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-xs text-slate-700">
                      <option>UTC+00:00 (London, Dublin, Lisbon)</option>
                      <option>UTC-05:00 (New York, Eastern Time)</option>
                      <option>UTC+09:00 (Tokyo, Osaka, Seoul)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: ASSESSMENT DEFAULTS */}
        <TabsContent value="defaults">
          <Card>
            <CardHeader>
              <CardTitle>Global Assessment Defaults</CardTitle>
              <CardDescription>Standard configurations applied when creating new tests</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Default Speaking Prep Time</label>
                    <Input defaultValue="45 seconds" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Default Max Recording Time</label>
                    <Input defaultValue="120 seconds" />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Default Writing Word Target</label>
                    <Input defaultValue="200 words" />
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <span className="font-semibold text-slate-900 block">Default Proctoring Rules:</span>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                    <span>Auto-enable Clipboard Paste Restriction</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                    <span>Auto-enable Tab Switch & Blur Tracking</span>
                  </label>
                </div>

                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  Save Defaults
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: CONSENT & DATA RETENTION */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Consent & Data Retention Compliance</CardTitle>
              <CardDescription>GDPR & SOC2 candidate data management controls</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Standard Retention Period</label>
                  <select className="w-64 h-9 border border-slate-200 rounded-lg px-3 bg-white text-xs text-slate-700">
                    <option>6 Months (Standard Recruitment Cycle)</option>
                    <option>12 Months (Extended Enterprise)</option>
                    <option>24 Months (Regulated Compliance)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Candidate audio blobs and written submissions are automatically scheduled for purge after this period.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Privacy Notice Text Preview</label>
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 leading-relaxed font-mono text-[11px]">
                    &quot;Your audio recordings, reading answers, and written submissions are collected exclusively for linguistic evaluation mapped to the Common European Framework of Reference (CEFR). No biometric voice embeddings are utilized for identity verification or sold to third parties.&quot;
                  </div>
                </div>

                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  Save Retention Policy
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: CANDIDATE DATA DELETION */}
        <TabsContent value="deletion">
          <Card className="border-rose-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <CardTitle className="text-rose-900">Candidate Data Deletion Request (GDPR Article 17)</CardTitle>
              </div>
              <CardDescription>
                Process candidate &quot;Right to be Forgotten&quot; requests to purge linguistic records.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                When a candidate submits an erasure request, entering their registered email address below will initiate the purge process for all associated audio recordings, transcripts, and evaluation scorecards.
              </p>

              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                <strong>Notice:</strong> This simulation demonstrates the GDPR Article 17 frontend request workflow. In standalone demo mode, operations are recorded locally.
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="gap-1.5 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Initiate Candidate Data Erasure</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Erasure Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogClose onClose={() => setIsDeleteModalOpen(false)} />
        <DialogHeader>
          <DialogTitle>Candidate Data Erasure Request</DialogTitle>
          <DialogDescription>
            Enter the candidate email to queue all linguistic test records for permanent purge.
          </DialogDescription>
        </DialogHeader>

        {deleteSuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Erasure request queued for {deleteEmail}. Audit ticket #GDPR-2026-DEL generated.</span>
          </div>
        ) : (
          <form onSubmit={handleDeleteRequest} className="space-y-4 text-xs mt-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Candidate Registered Email</label>
              <Input
                type="email"
                placeholder="e.g. candidate@example.com"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" size="sm">
                Confirm Purge Request
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </div>
  );
}

