import { getJobById } from "@/features/employers/jobs/server/jobs.queries";
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
    <>
      {/* Breadcrumbs */}
      <nav></nav>
      <pre>{JSON.stringify(job, null, 2)}</pre>
    </>
  );
};

export default JobsDetailedPage;
