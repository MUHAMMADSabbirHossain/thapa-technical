import ApplicantSidebar from "@/features/applicants/components/applicant-sidebar";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role !== "applicant") redirect("/employer-dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <ApplicantSidebar />
      <main className="container mx-auto mt-5 ml-70 mr-5">{children}</main>
    </div>
  );
};

export default DashboardLayout;
