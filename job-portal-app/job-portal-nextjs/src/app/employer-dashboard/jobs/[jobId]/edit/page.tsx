import { redirect } from "next/navigation";

interface EditJobPageProps {
  params: { jobId: string };
}

const EditJobPage = async ({ params }: EditJobPageProps) => {
  // const jobId = Number(params?.jobId); // this is not working as async operation

  const { jobId } = await params;

  if (Number.isNaN(jobId)) redirect("/employer-dashboard/jobs");

  return (
    <div className="flex flex-col gap-4">
      <h1>Edit Job</h1>

      <p>Editing job with ID: {jobId}</p>
    </div>
  );
};

export default EditJobPage;
