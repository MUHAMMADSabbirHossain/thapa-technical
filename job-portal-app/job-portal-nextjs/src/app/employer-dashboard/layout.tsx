import { getCurrentUser } from "@/features/auth/server/auth.queries";
import EmployerSidebar from "@/features/employers/components/employer-sidebar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const user = await getCurrentUser();
  console.log(user);

  if (!user) return redirect("/login");

  if (user.role !== "employer") return redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <EmployerSidebar />
      <main className="container mx-auto bg-background">{children}</main>
    </div>
  );
};

export default DashboardLayout;
