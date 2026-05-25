import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getAppliedJobsForApplicant } from "@/features/applicants/server/applicant.queries";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { formatDistanceToNow } from "date-fns";
import { Banknote, Building2, CheckCircle2, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function AppliedJobsage() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/login");
  }

  const applications = await getAppliedJobsForApplicant(user?.id);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Applied Jobs
        </h2>
        <p className="text-muted-foreground">
          You have applied to{" "}
          <span>
            {applications.length} {applications.length === 1 ? "job" : "jobs"}
          </span>
        </p>
      </div>

      {/* Empty state */}
      {applications.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            No applications yet
          </h3>
          <p className="text-gray-500 mb-6">
            You haven&apos;t applied to any jobs yet. Start exploring!
          </p>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => {
            const { application, job, employer } = app;

            return (
              <Card
                key={application.id}
                className="flex flex-col hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 flex-grow space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 relative rounded-md border bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {employer?.bannerImageUrl ? (
                        <Image
                          src={employer.bannerImageUrl}
                          alt={employer.name || "Company"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    {/* Applied Date Badge */}
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Applied
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium line-clamp-1">
                      {employer?.name || "Unknown Company"}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">
                        {job.location || "Remote"}
                      </span>
                    </div>
                    {(job.minSalary || job.maxSalary) && (
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4" />
                        <span>
                          {job.salaryCurrency} {job.minSalary} - {job.maxSalary}
                          / {job.salaryPeriod?.toLowerCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Applied
                        {formatDistanceToNow(new Date(application.appliedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      View Job Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AppliedJobsage;
