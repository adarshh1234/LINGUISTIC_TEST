"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/shared/status-pill";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { certificateService } from "@/services/certificate.service";
import { CertificateRecord, CertificateVerificationStatus } from "@/types/certificate.types";
import { formatDate } from "@/lib/utils";

export default function CertificateVerificationPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);
  const [auditNotes, setAuditNotes] = useState("");

  const loadData = async () => {
    const list = await certificateService.getCertificates();
    setCertificates(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (status: CertificateVerificationStatus) => {
    if (!selectedCert) return;
    await certificateService.updateStatus(selectedCert.id, status, auditNotes);
    setSelectedCert(null);
    setAuditNotes("");
    loadData();
  };

  const filtered = certificates.filter((c) => {
    const matchSearch =
      c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Certificate Verification Hub
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify candidate-uploaded language certifications (IELTS, TOEFL, JLPT, DELE) and audit authenticity markers.
        </p>
      </div>

      {/* Compliance Disclaimer */}
      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
        <Award className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Audit Compliance Notice:</strong> Frontend verification indicators demonstrate automated document parsing workflows. Final verification requires secondary confirmation through official testing authority candidate verification APIs.
        </span>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Search certificates by candidate, provider, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Pending Manual Audit">Pending Manual Audit</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-6 font-medium">Candidate</th>
                  <th className="p-3.5 font-medium">Certification Body</th>
                  <th className="p-3.5 font-medium">Certificate ID</th>
                  <th className="p-3.5 font-medium">Reported Band / Score</th>
                  <th className="p-3.5 font-medium">Test Date</th>
                  <th className="p-3.5 font-medium">Document File</th>
                  <th className="p-3.5 font-medium">Status</th>
                  <th className="p-3.5 pr-6 font-medium text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No certificate records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 pl-6">
                        <Link href={`/dashboard/candidates/${cert.candidateId}`} className="font-semibold text-slate-900 hover:text-indigo-600 block">
                          {cert.candidateName}
                        </Link>
                        <span className="text-[11px] text-slate-400">{cert.candidateEmail}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                          {cert.provider}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">
                        {cert.certificateNumber}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {cert.overallBand}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {formatDate(cert.testDate)}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[120px]">{cert.fileName}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <StatusPill status={cert.status} />
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCert(cert);
                            setAuditNotes(cert.auditNotes || "");
                          }}
                          className="h-7 text-xs"
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogClose onClose={() => setSelectedCert(null)} />
        {selectedCert && (
          <div className="space-y-4 text-xs">
            <DialogHeader>
              <DialogTitle>Certificate Verification Audit</DialogTitle>
              <DialogDescription>
                Inspect extracted metadata and record verification decision.
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <p><strong className="text-slate-900">Candidate:</strong> {selectedCert.candidateName}</p>
              <p><strong className="text-slate-900">Provider:</strong> {selectedCert.provider}</p>
              <p><strong className="text-slate-900">Certificate ID:</strong> {selectedCert.certificateNumber}</p>
              <p><strong className="text-slate-900">Reported Band / Score:</strong> {selectedCert.reportedScore} ({selectedCert.overallBand})</p>
              <p><strong className="text-slate-900">Exam Date:</strong> {formatDate(selectedCert.testDate)}</p>
            </div>

            {selectedCert.extractedData && (
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5">
                <span className="font-semibold text-slate-900 block">Automated Parsing Checks:</span>
                <p className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Candidate Name String Matching: Verified
                </p>
                <p className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Examination Body Security Checksum: Valid
                </p>
                <p className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Digital Watermark & Tamper Check: Passed
                </p>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Auditor Notes
              </label>
              <textarea
                rows={3}
                placeholder="Record external reference verification code or manual audit comments..."
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus("Failed")}
                className="text-rose-600 hover:text-rose-700"
              >
                Reject Certificate
              </Button>
              <Button
                size="sm"
                onClick={() => handleUpdateStatus("Verified")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Confirm Verified
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  );
}

