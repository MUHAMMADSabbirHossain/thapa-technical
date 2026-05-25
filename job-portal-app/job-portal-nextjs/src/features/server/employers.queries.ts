"use server";

import db from "@/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import {
  applicants,
  employers,
  jobApplications,
  jobs,
  resumes,
  users,
} from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export const getCurrentEmployerDetails = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  if (currentUser?.role !== "employer") return null;

  const [employer] = await db
    .select()
    .from(employers)
    .where(eq(employers?.id, currentUser?.id));
  //   console.log("employer: ", employer);

  const isProfileCompleted =
    employer?.name &&
    employer?.description &&
    currentUser?.avatarUrl &&
    employer?.organizationType &&
    employer?.yearOfEstablishment;

  return { ...currentUser, employerDetails: employer, isProfileCompleted };
};

export async function getEmployerApplications(employerId: number) {
  const applications = await db
    .select({
      application: jobApplications,
      job: jobs,
      user: users,
      applicant: applicants,
      resume: resumes,
    })
    .from(jobApplications)
    .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
    .innerJoin(users, eq(users?.id, jobApplications?.applicantId))
    .leftJoin(applicants, eq(jobApplications?.applicantId, applicants?.id))
    .leftJoin(resumes, eq(jobApplications?.resumeId, resumes?.id))
    .where(eq(jobs?.employerId, employerId))
    .orderBy(desc(jobApplications?.appliedAt));

  return applications;
}
