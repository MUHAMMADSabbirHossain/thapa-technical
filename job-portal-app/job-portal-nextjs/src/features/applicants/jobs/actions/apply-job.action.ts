"use server";

import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { applyJobSchema, ApplyJobSchema } from "../../apply-job.schema";
import { jobApplications } from "@/drizzle/schema";
import db from "@/config/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function applyForJobAction(data: ApplyJobSchema) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { status: "error", message: "Unauthorized, Please login." };
    }

    const { data: validatedData, error } = applyJobSchema.safeParse(data);

    if (error) {
      // Return the very first zod validation error message
      return { status: "error", message: error?.issues[0].message };
    }

    const { jobId, resumeId, coverLetter } = validatedData;

    const existingApplication = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications?.applicantId, user?.id),
          eq(jobApplications?.jobId, jobId),
        ),
      )
      .limit(1);

    if (existingApplication.length > 0) {
      return {
        status: "error",
        message: "You have already applied for this job",
      };
    }

    await db.insert(jobApplications).values({
      jobId,
      applicantId: user?.id,
      resumeId,
      coverLetter: coverLetter || null,
    });

    revalidatePath(`/jobs/${jobId}`);

    return { status: "success", message: "Job applied successfully" };
  } catch (error) {
    console.error("Apply job error: ", error);

    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}
