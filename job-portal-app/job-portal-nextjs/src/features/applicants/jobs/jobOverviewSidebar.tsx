import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobDetailsType } from "@/features/employers/jobs/server/jobs.queries";

interface JobSidebarProps {
  job: NonNullable<JobDetailsType>; // "NonNullable" tells TS: "Trust me, job is not undefined here."
}

const JobOverviewSidebar = ({ job }: JobSidebarProps) => {
  // Helper for Salary
  const salaryDisplay =
    job?.minSalary && job?.maxSalary
      ? `${job?.salaryCurrency} ${job?.minSalary.toLocaleString()} - ${job?.maxSalary.toLocaleString()}`
      : "Not Disclosed";
  return (
    <div>
      <div className="space-y-6">
        {/* Job overview card */}
        <Card>
          <CardHeader className="bg-gray-50/50 pb-4">
            <CardTitle className="text-lg">Job Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6"></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobOverviewSidebar;
