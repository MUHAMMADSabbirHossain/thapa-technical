import ApplicantSettingsForm from "@/features/applicants/components/applicant-settings-form";
import { getApplicantProfileData } from "@/features/applicants/server/applicant.queries";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  const initialData = await getApplicantProfileData(user?.id);

  return (
    <div>
      {/* Header */}
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your personal information and professional profile.
        </p>
      </div>

      <ApplicantSettingsForm initialData={initialData} />
    </div>
  );
}

export default SettingsPage;
