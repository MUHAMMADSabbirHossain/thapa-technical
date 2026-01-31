import { Button } from "@/components/ui/button";
import { getAllJobs } from "@/features/employers/jobs/server/jobs.queries";
import Link from "next/link";

const JobsPage = async () => {
  const jobs = await getAllJobs();
  console.log(jobs);

  return (
    <div>
      <h1>Hello Jobs</h1>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded">
            <h2>
              {job?.title}, Posted By - {job?.companyName}
            </h2>

            <Link href={`/dashboard/jobs/${job?.id}`}>
              <Button>View Detailed Job</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
