interface EditJobPageProps {
  params: { jobId: string };
}

const JobsDetailedPage = async ({ params }: EditJobPageProps) => {
  const { jobId } = await params;
  //   console.log(jobId);

  return (
    <>
      {/* Breadcrumbs */}
      <nav></nav>
    </>
  );
};

export default JobsDetailedPage;
