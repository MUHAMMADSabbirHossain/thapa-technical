import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JobOverviewSidebar from "@/features/applicants/jobs/jobOverviewSidebar";
import { getJobById } from "@/features/employers/jobs/server/jobs.queries";
import { formatDistanceToNow } from "date-fns";
import { Building2, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface EditJobPageProps {
  params: { jobId: string };
}

const JobsDetailedPage = async ({ params }: EditJobPageProps) => {
  const { jobId } = await params;
  //   console.log(jobId);

  if (isNaN(parseInt(jobId))) return notFound();

  const job = await getJobById(parseInt(jobId));

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4 space-y-8">
      {/* --- Hero Header --- */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b pb-8">
        <div className="flex gap-5">
          {/* Logo */}
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border bg-gray-50">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.companyName || "Company"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-lg font-bold text-gray-400">
                {job.companyName?.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Title & Meta */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="font-medium text-blue-600 flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {job.companyName}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location || "Remote"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Posted{" "}
                {formatDistanceToNow(new Date(job.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button size="lg" className="w-full md:w-auto font-semibold">
            Apply Now
          </Button>
        </div>
      </div>

      {/* --- Main Grid Content --- */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Description (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              About the Job
            </h2>
            <div
              className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </section>

          {/* Tags */}
          {job.tags && (
            <section className="pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.split(",").map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar (1/3) */}
        <JobOverviewSidebar job={job} />
      </div>
    </div>
  );
};

export default JobsDetailedPage;
