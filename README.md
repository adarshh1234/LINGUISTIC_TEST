# Verbalis AI — Multilingual Linguistic Assessment Platform

An enterprise-grade, standalone **AI-Powered Multilingual Linguistic Assessment Platform** built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

The platform evaluates candidates' language proficiency against **CEFR standards (A1–C2)** across three major linguistic assessment modules:
1. **Speaking** (Structured Prompt-and-Record with browser MediaRecorder API & Live AI Conversational Simulation)
2. **Reading Comprehension** (Split-pane passage reading, contextual MCQs, vocabulary in context, sentence ordering)
3. **Professional Writing** (Executive email, technical summary & customer dispute synthesis, live word/char counters, copy-paste restrictions)

---

## 1. Project Architecture & Folder Structure

```
src/
├── app/
│   ├── (recruiter)/
│   │   ├── layout.tsx                     # Recruiter persistent sidebar & header shell
│   │   └── dashboard/
│   │       ├── page.tsx                   # Operations Overview (KPIs, Recharts completion & CEFR charts)
│   │       ├── jobs/
│   │       │   ├── page.tsx               # Job management table, search, filters & create modal
│   │       │   └── [id]/page.tsx          # Job detail, linguistic benchmarks & candidates assessed
│   │       ├── assessments/
│   │       │   ├── page.tsx               # Assessment listing, duplicate, archive, publish actions
│   │       │   ├── create/page.tsx        # 10-step assessment creation wizard (100% weight validation)
│   │       │   └── [id]/page.tsx          # Assessment detail & candidate breakdown
│   │       ├── candidates/
│   │       │   ├── page.tsx               # Candidate table, CEFR/WPM badges, CSV export
│   │       │   └── [id]/page.tsx          # Candidate scorecard (8 tabs, Radar chart, Explainable AI)
│   │       ├── analytics/
│   │       │   └── page.tsx               # Advanced recruiter analytics (9 Recharts visualizations)
│   │       ├── integrity/
│   │       │   └── page.tsx               # Integrity telemetry console, event audits & reviewer resolution
│   │       ├── certificates/
│   │       │   └── page.tsx               # IELTS/TOEFL/JLPT/DELE verification console & audit modals
│   │       ├── branding/
│   │       │   └── page.tsx               # White-label customization with live candidate portal preview
│   │       └── settings/
│   │           └── page.tsx               # Tenant settings, consent, retention & candidate data erasure UI
│   ├── login/page.tsx                     # Candidate access sign-in / invite code entry
│   ├── register/page.tsx                  # Candidate registration simulation
│   ├── forgot-password/page.tsx           # Invitation retrieval simulation
│   ├── candidate/
│   │   ├── page.tsx                       # Candidate assessment hub & active invitations
│   │   └── assessment/[id]/
│   │       ├── page.tsx                   # Step 1: Candidate identity confirmation
│   │       ├── consent/page.tsx           # Step 2: Explicit audio & AI language evaluation consent
│   │       ├── device-check/page.tsx      # Step 3: Real microphone Web Audio API test & network diagnostics
│   │       ├── instructions/page.tsx      # Step 4: Assessment instructions & guidelines
│   │       ├── speaking/page.tsx          # Step 5: Dual-mode speaking (MediaRecorder API & Live AI)
│   │       ├── reading/page.tsx           # Step 6: Timed split-pane reading comprehension
│   │       ├── writing/page.tsx           # Step 7: Professional writing editor with paste restrictions
│   │       ├── certificate/page.tsx       # Step 8: Document drag-and-drop certificate upload
│   │       ├── review/page.tsx            # Step 9: Pre-submission verification checklist
│   │       └── completed/page.tsx         # Step 10: Submission confirmation & completion receipt
│   ├── globals.css                        # Design tokens, variables & typography
│   ├── layout.tsx                         # Root Next.js layout
│   └── page.tsx                           # Master landing page with dual portal entry points
├── components/
│   ├── layout/                            # RecruiterSidebar, RecruiterHeader, CandidateHeader
│   ├── shared/                            # CefrBadge, WpmBadge, StatusPill, KpiCard, AudioWaveform
│   └── ui/                                # Card, Button, Input, Tabs, Dialog, Progress, Badge
├── hooks/                                 # useAudioRecorder, useCountdownTimer, useIntegrityMonitor
├── lib/
│   ├── utils.ts                           # Formatting, class merging (cn), CSV export
│   └── mock-data/                         # Jobs, Assessments, Candidates, Analytics, Integrity, Certificates
├── services/                              # Typed API abstraction layer (job, assessment, candidate, etc.)
├── store/                                 # Zustand stores (Assessment builder, Candidate test session)
└── types/                                 # TypeScript domain contracts (CEFR, Job, Assessment, Candidate, etc.)
```

---

## 2. Key Modules & Functional Capabilities

### Recruiter Experience
- **Executive KPI Dashboard**: Metrics for Total Assessments, Active Assessments, Completed Assessments, Total Candidates, Average Score, CEFR Distribution, Certificates Pending Audit, and Integrity Alerts.
- **Dynamic Recharts Data Visualizations**:
  - Assessment Completion Trends (Invited vs Completed area chart)
  - CEFR Level Distribution (A1–C2 donut chart)
  - Speaking vs Reading vs Writing Scores (Multi-bar chart)
  - Language-wise Candidate Distribution (Horizontal bar chart)
  - WPM Pacing Velocity Breakdown
  - Assessment Integrity Risk Distribution
- **10-Step Assessment Builder Wizard**:
  - Basic Information & Role Mapping
  - Language & Multi-CEFR Target Configuration (A1–C2)
  - Module Enablement with **Automatic 100% Weight Sum Validation**
  - Speaking Configuration (Prompt vs AI Conversational, prep time, recording limit)
  - Reading Configuration (Passage types, duration, question formats)
  - Writing Configuration (Task genre, word limits, copy/paste policy)
  - Third-party Certificate Requirements (IELTS, TOEFL, JLPT, DELE)
  - Integrity Signals (Tab switching, clipboard paste, audio stream monitoring)
  - GDPR/SOC2 Candidate Consents
  - Review & Instant Publishing
- **Candidate Scorecard with Explainable AI Report**:
  - Overall Score (0–100) & Achieved CEFR Benchmark
  - Multidimensional Competency Radar Chart
  - **"Why This Score?"** breakdown:
    - Strengths
    - Detected Linguistic Errors with original phrases, corrections, and syntactic rationale
    - Evaluated Rubric Dimensions
    - Speech velocity (Words Per Minute & Pacing classification)
- **Integrity Telemetry Console**:
  - Severity-tagged signals (`TAB_BLUR_DETECTED`, `CLIPBOARD_INTERCEPTED`, `MICROPHONE_DISCONNECT`, `UNUSUAL_PAUSE`, `NETWORK_DISCONNECTED`, `ASSESSMENT_RESTART`)
  - Recruiter audit drawer with resolution notes
- **White-Label Branding**:
  - Live preview reflecting custom colors, organization name, and candidate greeting in real time.

### Candidate Experience
- **Distraction-Free Test Flow**: Complete isolation from recruiter scoring and internal evaluation notes.
- **Microphone Diagnostics**: Real browser microphone stream calibration with live amplitude level meter and audio playback.
- **Speaking Assessment**:
  - **Mode A**: Structured Prompt-and-Record with real browser **MediaRecorder API**, countdown prep, recording timer, and live waveform visualization.
  - **Mode B**: Simulated AI Conversational Interview with live transcript streaming and candidate turn-taking.
- **Reading Assessment**: Split-screen desktop experience with timed passage, contextual questions, and question flagging.
- **Professional Writing Editor**: Word and character counter, minimum requirement validation, and client-side clipboard paste protection.
- **Certificate Upload**: Drag-and-drop document upload (PDF/JPG/PNG) with test score metadata extraction.

---

## 3. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict type safety)
- **Styling**: Tailwind CSS & Lucide React
- **Component Architecture**: Modular design system (Linear / Stripe aesthetic)
- **Data Visualization**: Recharts (Area, Bar, Line, Pie, Radar)
- **State Management**: Zustand
- **Browser APIs**: MediaRecorder API, Web Audio API, Browser File API, Visibility API

---

## 4. Setup & Running Locally

Install dependencies:
```bash
npm install
```
*(or with bun: `bun install`)*

Run development server:
```bash
npm run dev
```
*(or with bun: `bun run dev`)*

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:
```bash
npm run build
```

---

## 5. Future LetGetIn Integration Architecture

This application is engineered as a standalone module designed for seamless future embedding into the **LetGetIn** recruitment platform:
- **Clean Service Abstraction**: All data access is mediated through `assessmentService`, `candidateService`, `jobService`, `integrityService`, and `certificateService`.
- **Zero Hardcoding**: UI components never contain inline data; replacing mock storage with real HTTP endpoints requires modifying only the service layer files in `src/services/`.
- **Environment-Ready**: Ready for `.env.local` API baseURL integration:
  ```env
  NEXT_PUBLIC_APP_NAME="Verbalis AI Linguistic Assessment Platform"
  NEXT_PUBLIC_API_BASE_URL=
  ```
- **Context Decoupling**: Candidate, Assessment, and Job IDs are treated as configurable identifiers, ready to accept external session tokens passed by LetGetIn.
