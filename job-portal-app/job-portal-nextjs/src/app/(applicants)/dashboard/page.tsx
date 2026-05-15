import ApplicantProfileStatus from "@/features/applicants/components/applicant-profile-status";
import ApplicantStats from "@/features/applicants/components/applicant-stats";
import RecentApplications from "@/features/applicants/components/recent-applications";
import { logoutUserAction } from "@/features/auth/server/auth.actions";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

const applicantDashboard = async () => {
  const user = await getCurrentUser();

  // Redirect if not logged in
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Hello, <span className="capitalize">{user?.name || "User"}</span>
        </h1>
        <p className="text-gray-500">
          Here is your daily activities and job alerts.
        </p>
      </div>

      {/* 1. Start Row */}
      <ApplicantStats />

      {/* 2. Red Alert Banner (Profile Incomplete) */}
      <ApplicantProfileStatus />

      {/* 3. Recently Applied Table */}
      <RecentApplications />

      <button onClick={logoutUserAction}>Logout</button>
    </div>
  );
};

export default applicantDashboard;
