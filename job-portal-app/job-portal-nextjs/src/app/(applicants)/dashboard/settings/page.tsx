import ApplicantSettingsForm from "@/features/applicants/components/applicant-settings-form";

function SettingsPage() {
  return (
    <div>
      {/* Header */}
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your personal information and professional profile.
        </p>
      </div>

      <ApplicantSettingsForm />
    </div>
  );
}

export default SettingsPage;
