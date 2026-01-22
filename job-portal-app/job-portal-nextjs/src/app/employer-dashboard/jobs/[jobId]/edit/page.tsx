import JobForm from "@/features/employers/components/employer-job-form";
import { getJobByIdAction } from "@/features/server/jobs.actions";
import { redirect } from "next/navigation";

interface EditJobPageProps {
  params: { jobId: string };
}

const EditJobPage = async ({ params }: EditJobPageProps) => {
  // const jobId = Number(params?.jobId); // this is not working as async operation

  const { jobId } = await params;

  if (Number.isNaN(jobId)) redirect("/employer-dashboard/jobs");

  // fetch job by id
  const { status, data: job } = await getJobByIdAction(Number(jobId));

  if (status === "error" || !job) {
    redirect("/employer-dashboard/jobs");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Job: {job?.title}</h1>
      </div>

      <JobForm initialData={job} isEditMode={true} />
    </div>
  );
};

export default EditJobPage;
