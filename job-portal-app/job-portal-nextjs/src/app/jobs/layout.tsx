import ApplicantSidebar from "@/features/applicants/components/applicant-sidebar";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { ReactNode } from "react";

async function JobsLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const isApplicant = user?.role === "applicant";

  if (isApplicant) {
    return (
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        <aside className="w-full md:w-64 shrink-0 brorder-r bg-white">
          <ApplicantSidebar />
        </aside>
        <main className="flex-1 bg-gray-50/30">{children}</main>
      </div>
    );
  }

  return (
    <main className="bg-gray-50/30 min-h-[calc(100vh-64px)]">{children}</main>
  );
}

export default JobsLayout;
