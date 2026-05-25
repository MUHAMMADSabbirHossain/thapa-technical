import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { Badge, Building2, CheckCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppliedJobsForApplicant } from "../server/applicant.queries";
import Image from "next/image";
import { formatDate } from "date-fns";

// Mock Data to match your screenshot
const RECENT_APPLICATIONS = [
  {
    id: 1,
    title: "Networking Engineer",
    type: "Remote",
    location: "Washington",
    salary: "$50k-80k/month",
    data: "Feb 2, 2026 19:28",
    status: "Active",
    logo: "/companies/google.png", // Replace with real logos or placeholders
    company: "Google",
    typeColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  {
    id: 2,
    title: "Senior Front-End Engineer",
    type: "Remote",
    location: "Washington",
    salary: "$50k-80k/month",
    data: "Feb 2, 2026 19:28",
    status: "Active",
    logo: "/companies/google.png",
    company: "Google",
    typeColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  {
    id: 3,
    title: "Senior Front-End Engineer",
    type: "Remote",
    location: "Washington",
    salary: "$50k-80k/month",
    data: "Feb 2, 2026 19:28",
    status: "Active",
    logo: "/companies/google.png",
    company: "Google",
    typeColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  {
    id: 4,
    title: "Senior Front-End Engineer",
    type: "Remote",
    location: "Washington",
    salary: "$50k-80k/month",
    data: "Feb 2, 2026 19:28",
    status: "Active",
    logo: "/companies/google.png",
    company: "Google",
    typeColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
];

async function RecentApplications() {
  const user = await getCurrentUser();

  if (!user) {
    return redirect("/login");
  }

  const applications = await getAppliedJobsForApplicant(user?.id);

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-5 p-6">
        <h3 className="font-semibold text-gray-900">Recently Applied</h3>

        <Link
          href={"/dashboard/applied-jobs"}
          className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1"
        >
          View all
        </Link>
      </div>

      {recentApplications.length === 0 ? (
        <div className="flex items-center justify-center p-6">
          <p className="text-sm text-gray-500">
            You have not applied to any job yet.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%] pl-6">Job</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentApplications.map((app) => {
              const { application, job, employer } = app;
              return (
                <TableRow key={application?.id} className="hover:bg-gray-50">
                  {/* Job Info Column */}
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-start gap-4">
                      {/* Logo Placeholder */}
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500 overflow-hidden border">
                        {employer?.bannerImageUrl ? (
                          <Image
                            src={employer?.bannerImageUrl}
                            alt={employer?.name || "Company"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {job?.title}
                        </span>
                        <Badge
                          className={`rounded-full px-2 py-0.5 text-[10px] font-normal border-0 bg-blue-100 text-blue-700 hover:bg-blue-100 whitespace-nowrap`}
                        >
                          {job?.jobType}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3">
                            {job?.location || "Remote"}
                          </MapPin>
                        </span>
                        {(job?.minSalary || job?.maxSalary) && (
                          <span>
                            {job?.salaryCurrency} {job?.minSalary} -{" "}
                            {job?.maxSalary}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Data Column */}
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(
                      new Date(application?.appliedAt),
                      "MMM d, yyyy",
                    )}
                  </TableCell>

                  {/* Status Column */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                      <CheckCircle className="h-4 w-4" /> Applied
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right pr-6">
                    <Button
                      variant={"secondary"}
                      size={"sm"}
                      className="bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium"
                    >
                      <Link href={`/dashboard/jobs/${job?.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default RecentApplications;
