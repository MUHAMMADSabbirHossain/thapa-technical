"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Job } from "../jobs/types/job.types";
import { Loader2 } from "lucide-react";
import { getEmployerJobsAction } from "@/features/server/jobs.actions";
import EmployerJobCard from "./employer-job-card";

const EmployerJobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);

      try {
        const res = await getEmployerJobsAction();

        if (res?.status === "success" && res?.data) {
          setJobs(res?.data);
        } else {
          toast.error(res?.message || "Failed to fetch jobs");
        }
      } catch (error) {
        toast.error(error?.message || "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (jobs?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No jobs found</p>
      </div>
    );
  }

  return (
    <section>
      {jobs?.map((job) => (
        <EmployerJobCard key={job?.id} job={job} />
      ))}
    </section>
  );
};

export default EmployerJobList;
