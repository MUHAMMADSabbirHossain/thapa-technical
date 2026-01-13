interface EditJobPageProps {
  params: { jobId: string };
}

const JobID = async ({ params }: EditJobPageProps) => {
  const { jobId } = await params;

  if (Number.isNaN(Number(jobId))) {
    throw new Error("Invalid job ID");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Edit Job</h1>

      <p>Editing job with ID: {jobId}</p>
    </div>
  );
};

export default JobID;
