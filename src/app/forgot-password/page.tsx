"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link href="/login" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>

        <Card className="border-slate-800 bg-slate-800/80 backdrop-blur text-white">
          <CardHeader>
            <CardTitle className="text-white text-base">Retrieve Assessment Invitation</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your email to re-send your secure assessment access link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs space-y-2 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="font-semibold">Access link dispatched!</p>
                <p className="text-[11px] text-emerald-400/80">
                  Check your inbox for a magic sign-in link to launch your linguistic assessment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. candidate@example.com"
                    className="bg-slate-900/60 border-slate-700 text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs">
                  Resend Assessment Link
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

