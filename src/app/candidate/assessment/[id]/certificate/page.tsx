"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Award,
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { useCandidateTestStore } from "@/store/candidate-test-store";
import { CertificateProvider } from "@/types/assessment.types";

export default function CandidateCertificateUploadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [provider, setProvider] = useState<CertificateProvider>("IELTS");
  const [certNumber, setCertNumber] = useState("IELTS-2025-GB-992144");
  const [reportedScore, setReportedScore] = useState("8.5");
  const [testDate, setTestDate] = useState("2025-08-14");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>({
    name: "IELTS_Official_TRF_Rostova.pdf",
    size: 1420000,
  });
  const [isUploading, setIsUploading] = useState(false);

  const setCertificateUpload = useCandidateTestStore((s) => s.setCertificateUpload);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setUploadedFile({ name: file.name, size: file.size });
        setIsUploading(false);
      }, 800);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleProceed = () => {
    if (uploadedFile) {
      setCertificateUpload({
        provider,
        certNumber,
        score: reportedScore,
        fileName: uploadedFile.name,
      });
    } else {
      setCertificateUpload(null);
    }
    router.push(`/candidate/assessment/${id}/review`);
  };

  const handleSkip = () => {
    setCertificateUpload(null);
    router.push(`/candidate/assessment/${id}/review`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader currentStepTitle="Certificate Submission" stepNumber={8} totalSteps={10} />

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10 space-y-6 animate-in fade-in duration-150">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Step 8 of 10 · Verification Documents
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Third-Party Language Certifications
          </h1>
          <p className="text-xs text-slate-500">
            Attach prior standardized language test reports (IELTS, TOEFL, JLPT, DELE) to support your evaluation.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Document Upload (Optional)</CardTitle>
                <CardDescription className="text-xs">
                  Accepted formats: PDF, JPG, PNG (Max 10MB)
                </CardDescription>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                Optional Step
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* File Upload Zone */}
            {!uploadedFile ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/30">
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                <span className="font-semibold text-slate-800">
                  {isUploading ? "Uploading document..." : "Click or drag & drop certificate report"}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">PDF, JPG, or PNG up to 10MB</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileDrop}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block truncate max-w-xs sm:max-w-md">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {Math.round(uploadedFile.size / 1024)} KB · Ready for recruiter audit
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Certificate Details Form */}
            {uploadedFile && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Certification Body</label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value as CertificateProvider)}
                      className="w-full h-9 border border-slate-200 rounded-lg px-3 bg-white text-xs text-slate-700"
                    >
                      <option value="IELTS">IELTS (International English Language Testing)</option>
                      <option value="TOEFL">TOEFL (Test of English as a Foreign Language)</option>
                      <option value="GRE">GRE Verbal Reasoning</option>
                      <option value="JLPT">JLPT (Japanese Language Proficiency Test)</option>
                      <option value="DELE">DELE (Diplomas de Español como Lengua Extranjera)</option>
                      <option value="OTHER">Other National / International Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">TRF / Certificate Number</label>
                    <Input
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                      placeholder="e.g. TRF-2025-XXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Overall Band / Reported Score</label>
                    <Input
                      value={reportedScore}
                      onChange={(e) => setReportedScore(e.target.value)}
                      placeholder="e.g. 8.5 / 120 / N1"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Examination Date</label>
                    <Input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button type="button" variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-slate-500 hover:text-slate-900">
                Skip Certificate Upload
              </Button>

              <Button
                type="button"
                onClick={handleProceed}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-sm"
              >
                <span>Continue to Final Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

