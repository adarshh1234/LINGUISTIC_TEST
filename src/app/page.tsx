import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Mic,
  BookOpen,
  PenTool,
  Sparkles,
  BarChart2,
  Lock,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
            V
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight">Verbalis AI</span>
            <span className="text-[11px] text-slate-400 block leading-none">Multilingual Linguistic Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs">
              Candidate Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 shadow-sm">
              <span>Recruiter Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Standalone Enterprise Architecture · Ready for LetGetIn Integration</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl">
          Enterprise CEFR Language Proficiency <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Benchmarking</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Standardized CEFR evaluation (A1–C2) covering Speaking, Reading Comprehension, and Professional Writing with integrity monitoring and explainable linguistic scorecards.
        </p>

        {/* Dual Access Portals */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl text-left">
          {/* Recruiter Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/70 p-6 flex flex-col justify-between transition-all hover:border-indigo-500/50 group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Recruiter / Org Dashboard</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Manage jobs, build 10-step custom assessments, review candidate CEFR scorecards, inspect WPM metrics, audit certificates, and monitor test integrity.
              </p>
            </div>
            <Link href="/dashboard" className="mt-6">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5">
                <span>Enter Recruiter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Candidate Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/70 p-6 flex flex-col justify-between transition-all hover:border-emerald-500/50 group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Candidate Assessment Portal</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Clean, distraction-free candidate test flow: device & mic check, consent, speaking recording with waveforms, reading timer, and writing autosave.
              </p>
            </div>
            <Link href="/candidate" className="mt-6">
              <Button variant="outline" className="w-full border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1.5">
                <span>Launch Candidate Experience</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Module Features Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl text-left">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
              <Mic className="w-4 h-4" />
              <span>Speaking Evaluation</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Structured Prompt-and-Record with real MediaRecorder API and Live AI interview simulation modes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Reading Comprehension</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Split desktop passages, contextual MCQs, vocabulary questions, timers, and question flagging.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-semibold mb-1">
              <PenTool className="w-4 h-4" />
              <span>Business Writing</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Professional email, customer service & tech summaries with word counting and copy-paste detection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span>Verbalis AI Linguistic Assessment</span>
          <span>·</span>
          <span>Frontend Architecture Showcase</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">TypeScript · Next.js App Router · Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}

