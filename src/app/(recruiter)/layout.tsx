import { RecruiterSidebar } from "@/components/layout/recruiter-sidebar";
import { RecruiterHeader } from "@/components/layout/recruiter-header";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <RecruiterSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <RecruiterHeader />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

