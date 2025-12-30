import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const user = await getCurrentUser();
  console.log(user);

  if (!user) return redirect("/login");

  if (user.role !== "employer") return redirect("/dashboard");

  return children;
};

export default DashboardLayout;
