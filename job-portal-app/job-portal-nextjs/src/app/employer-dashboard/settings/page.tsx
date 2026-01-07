import EmployerSettingsForm from "@/features/employers/components/employer-settings-form";
import { getCurrentEmployerDetails } from "@/features/server/employers.queries";
import { redirect } from "next/navigation";
import { EmployerProfileData } from "@/features/employers/employers.schema";

const EmployerSettings = async () => {
  const employer = await getCurrentEmployerDetails();

  if (!employer) return redirect("/login");

  return (
    <div>
      <EmployerSettingsForm
        initialData={{
          name: employer?.employerDetails?.name || "",
          description: employer?.employerDetails?.description || "",
          organizationType:
            (employer?.employerDetails
              ?.organizationType as EmployerProfileData["organizationType"]) ||
            undefined,
          teamSize:
            (employer?.employerDetails
              ?.teamSize as EmployerProfileData["teamSize"]) || undefined,
          yearOfEstablishment:
            employer?.employerDetails?.yearOfEstablishment?.toString() || "",
          location: employer?.employerDetails?.location || "",
          websiteUrl: employer?.employerDetails?.websiteUrl || "",
          avatarUrl: employer?.avatarUrl || "",
        }}
      />
    </div>
  );
};

export default EmployerSettings;
