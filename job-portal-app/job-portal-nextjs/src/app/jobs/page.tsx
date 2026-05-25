import JobFilters from "@/features/applicants/jobs/components/job-filters";
import JobCard from "@/features/employers/jobs/components/jobCard";
import {
  getAllJobs,
  JobfilterParams,
} from "@/features/employers/jobs/server/jobs.queries";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const JobsPage = async ({ searchParams }: PageProps) => {
  const resolvedParams = await searchParams;
  console.log("resovedParams: ", resolvedParams);

  const filters: JobfilterParams = {
    search:
      typeof resolvedParams.search === "string"
        ? resolvedParams.search
        : undefined,
    jobType:
      typeof resolvedParams.jobType === "string"
        ? resolvedParams.jobType
        : undefined,
    jobLevel:
      typeof resolvedParams.jobLevel === "string"
        ? resolvedParams.jobLevel
        : undefined,
    workType:
      typeof resolvedParams.workType === "string"
        ? resolvedParams.workType
        : undefined,
  };

  // 1. Fetch data directly on server
  const jobs = await getAllJobs(filters);
  // console.log(jobs);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Find your Next Dream Job
        </h1>
        <p className="text-gray-500">
          Browse latest job openings from top companies
        </p>
      </div>
      {/* 3. Add the Filter Component Here */}
      <JobFilters />
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1  gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job?.id} job={job} />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border-dashed border-gray-300 bg-gray-50 text-center">
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Jobs Found
          </h3>
          <p className="text-gray-500">
            Check back later for new opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
