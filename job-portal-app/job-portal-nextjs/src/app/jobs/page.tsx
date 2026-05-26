import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

  // 1. Pagination Constants
  const currentPage = Number(resolvedParams?.page) || 1;
  const ITEMS_PER_PAGE = 10;

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
    page: String(currentPage),
    limit: String(ITEMS_PER_PAGE),
  };

  // 2. Fetch data directly on server
  const { jobs, totalCount } = await getAllJobs(filters);
  // console.log(jobs);

  // 3. Pagination Math
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 4. Calculate the 3-page Sliding Window
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    endPage = Math.min(totalPages, 3);
  } else if (currentPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  // 5. Helper to preserve search filters in the URL when changing pages
  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();

    // Copy all existing search params
    Object.entries(resolvedParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, String(value));
      }
    });

    params.set("page", String(pageNum));

    return `/jobs?${params.toString()}`;
  };

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

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="pt-6 border-t mt-8">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Dynamic 3-Page Window */}
              {visiblePages.map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={createPageUrl(pageNum)}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? createPageUrl(currentPage + 1)
                      : "#"
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
