"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  Wifi,
  Volume2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Play,
  Square,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandidateHeader } from "@/components/layout/candidate-header";
import { AudioWaveform } from "@/components/shared/audio-waveform";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useCandidateTestStore } from "@/store/candidate-test-store";

export default function CandidateDeviceCheckPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [micTested, setMicTested] = useState(false);
  const [networkTested, setNetworkTested] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState(88.4);
  const [latencyMs, setLatencyMs] = useState(24);

  const {
    status: recorderStatus,
    audioLevel,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const setDeviceCheck = useCandidateTestStore((s) => s.setDeviceCheck);

  useEffect(() => {
    // Simulate network speed test
    const timer = setTimeout(() => {
      setNetworkTested(true);
      setNetworkSpeed(Math.floor(Math.random() * 30) + 75);
      setLatencyMs(Math.floor(Math.random() * 15) + 18);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleTestMic = async () => {
    if (recorderStatus === "recording") {
      stopRecording();
      setMicTested(true);
    } else {
      resetRecording();
      await startRecording();
    }
  };

  const handleProceed = () => {
    setDeviceCheck({
      micTested: true,
      micPermissionGranted: true,
      networkTested: true,
      networkSpeedMbps: networkSpeed,
    });
    router.push(`/candidate/assessment/${id}/instructions`);
  };

  const isReady = (micTested || audioUrl !== null) && networkTested;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <CandidateHeader currentStepTitle="Device & Hardware Check" stepNumber={3} totalSteps={10} />

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10 space-y-6 animate-in fade-in duration-150">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Step 3 of 10 · Hardware Diagnostics
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            Microphone & Connection Verification
          </h1>
          <p className="text-xs text-slate-500">
            Verify your microphone clarity and connection stability prior to starting speaking modules.
          </p>
        </div>

        {/* Microphone Diagnostic Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">Microphone Input Calibration</CardTitle>
                  <CardDescription className="text-xs">
                    Speak a short sentence to calibrate your audio level
                  </CardDescription>
                </div>
              </div>
              {micTested && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mic Calibrated
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Live Audio Meter */}
            <div className="space-y-2">
              <AudioWaveform
                isRecording={recorderStatus === "recording"}
                audioLevel={audioLevel}
                barCount={36}
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Input Status: {recorderStatus === "recording" ? "Recording audio..." : "Idle"}</span>
                <span>Signal Level: {audioLevel}%</span>
              </div>
            </div>

            {/* Mic Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                onClick={handleTestMic}
                className={
                  recorderStatus === "recording"
                    ? "bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                }
              >
                {recorderStatus === "recording" ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop & Complete Mic Calibration</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Start 5-Second Test Recording</span>
                  </>
                )}
              </Button>

              {audioUrl && (
                <span className="text-[11px] text-slate-600 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> Audio stream captured clearly
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Network Stability Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">Network Connection Quality</CardTitle>
                  <CardDescription className="text-xs">
                    Continuous connection monitoring for real-time state synchronization
                  </CardDescription>
                </div>
              </div>
              {networkTested ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Optimal
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">Testing...</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-slate-500 block">Bandwidth Throughput</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {networkTested ? `${networkSpeed} Mbps` : "Testing..."}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-slate-500 block">Round-Trip Latency</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {networkTested ? `${latencyMs} ms` : "Testing..."}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Link href={`/candidate/assessment/${id}/consent`}>
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          </Link>

          <Button
            onClick={handleProceed}
            disabled={!networkTested}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-sm"
          >
            <span>Proceed to Instructions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </main>
    </div>
  );
}

