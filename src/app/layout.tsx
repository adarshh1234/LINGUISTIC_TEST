import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verbalis AI — Multilingual Linguistic Assessment Platform",
  description: "Enterprise CEFR linguistic assessment platform for speaking, reading comprehension, and business writing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

