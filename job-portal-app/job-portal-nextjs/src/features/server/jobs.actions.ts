"use server";

import db from "@/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import { JobFormData, jobSchema } from "../employers/jobs/jobs.schema";
import { jobs } from "@/drizzle/schema";
import { Job } from "../employers/jobs/types/job.types";
import { and, eq } from "drizzle-orm";

export const createJobAction = async (data: JobFormData) => {
  try {
    const { success, data: result, error } = jobSchema.safeParse(data);

    if (!success) {
      console.log("ZOD ERRORS: ", error?.flatten());
      console.log("RECEIVED DATA: ", data);

      return { status: "error", message: error?.issues[0].message };
    }

    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role !== "employer") {
      return { status: "error", message: "Unauthorized" };
    }

    await db.insert(jobs).values({ ...result, employerId: currentUser?.id });

    return { status: "success", message: "job posted successfully" };
  } catch (error) {
    console.error(error);

    return { status: "error", message: "Something went wrong" };
  }
};

export const getEmployerJobsAction = async (): Promise<{
  status: "success" | "error";
  data?: Job[];
  message?: string;
}> => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role !== "employer") {
      return { status: "error", message: "Unauthorized", data: [] };
    }

    const result = await db
      .select()
      .from(jobs)
      .where(eq(jobs?.employerId, currentUser?.id));

    return {
      status: "success",
      data: result as Job[],
      message: "Jobs fetched successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong",
      data: [],
    };
  }
};

export const deleteJobAction = async (
  jobId: number,
): Promise<{
  status: "success" | "error";
  message?: string;
  data?: number;
}> => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role !== "employer") {
      return { status: "error", message: "Unauthorized" };
    }

    await db
      .delete(jobs)
      .where(and(eq(jobs?.employerId, currentUser?.id), eq(jobs?.id, jobId)));

    return {
      status: "success",
      message: "Job deleted successfully",
      data: jobId,
    };
  } catch (error) {
    console.error(error);

    return { status: "error", message: "Something went wrong", data: jobId };
  }
};

export const getJobByIdAction = async (jobId: number) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role !== "employer") {
      return { status: "error", message: "Unauthorized", data: null };
    }

    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs?.id, jobId), eq(jobs?.employerId, currentUser?.id)))
      .limit(1);

    if (!job) {
      return { status: "error", message: "Job not found", data: null };
    }

    return {
      status: "success",
      message: "Job fetched successfully",
      data: job,
    };
  } catch (error) {
    return { status: "error", message: "Failed to fetch job", data: null };
  }
};
