"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("Elena Rostova");
  const [email, setEmail] = useState("elena.rostova@example.com");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/candidate");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white">Candidate Registration</h2>
          <p className="text-xs text-slate-400">Create your linguistic evaluation test account</p>
        </div>

        <Card className="border-slate-800 bg-slate-800/80 backdrop-blur text-white">
          <CardHeader>
            <CardTitle className="text-white text-base">Candidate Profile Setup</CardTitle>
            <CardDescription className="text-slate-400">Enter your details to link your assessment invitation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Full Legal Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-900/60 border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/60 border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Native Language</label>
                <select className="w-full h-9 border border-slate-700 rounded-lg px-3 bg-slate-900/60 text-white text-xs">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                  <option>Other</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 mt-2">
                <span>Continue to Candidate Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>

            <div className="text-center text-[11px] text-slate-400 mt-4">
              Already have an invitation link?{" "}
              <Link href="/login" className="text-indigo-400 hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

