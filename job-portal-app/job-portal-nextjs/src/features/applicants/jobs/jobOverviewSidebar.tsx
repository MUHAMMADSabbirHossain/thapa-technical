import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobDetailsType } from "@/features/employers/jobs/server/jobs.queries";
import {
  Banknote,
  Briefcase,
  CalendarDays,
  Globe,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

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
          <CardContent className="space-y-5 pt-6">
            <OverviewItem
              icon={<Banknote className="h-5 w-5 text-gray-500" />}
              label="Salary"
              value={salaryDisplay}
            />

            <OverviewItem
              icon={<Briefcase className="h-5 w-5 text-gray-500" />}
              label="Job Type"
              value={job.jobType?.replace("-", " ")}
            />

            <OverviewItem
              icon={<CalendarDays className="h-5 w-5 text-gray-500" />}
              label="Work Type"
              value={job.workType?.replace("-", " ")}
            />

            <OverviewItem
              icon={<GraduationCap className="h-5 w-5 text-gray-500" />}
              label="Experience Level"
              value={job.jobLevel?.replace("-", " ")}
            />

            <OverviewItem
              icon={<GraduationCap className="h-5 w-5 text-gray-500" />}
              label="Education"
              value={job.minEducation?.replace("-", " ")}
            />
          </CardContent>
        </Card>

        {/* Company Snippet Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About the Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <p className="text-sm text-gray-600 line-clamp-4">
                    {job.companyBio || "No company description available."}
                  </p> */}
            <p
              className="text-sm text-gray-600 line-clamp-4 prose prose-sm"
              dangerouslySetInnerHTML={{
                __html: job.companyBio || "No company description available.",
              }}
            />

            {job.companyWebsite && (
              <Link
                href={job.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit company website (opens in new tab)"
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
              >
                <Globe className="h-4 w-4" />
                Visit Website
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobOverviewSidebar;

const OverviewItem = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | null | undefined;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
        <p className="text-sm font-semibold text-gray-900 capitalize">
          {value}
        </p>
      </div>
    </div>
  );
};
