"use server";

import db from "@/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import { JobFormData, jobSchema } from "../employers/jobs/jobs.schema";
import { jobs } from "@/drizzle/schema";

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
