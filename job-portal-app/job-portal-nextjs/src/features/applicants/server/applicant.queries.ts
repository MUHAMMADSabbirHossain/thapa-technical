import db from "@/config/db";
import {
  applicants,
  employers,
  jobApplications,
  jobs,
  resumes,
  users,
} from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export async function getApplicantProfileData(userId: number) {
  const [combinedData] = await db
    .select({
      user: users,
      applicant: applicants,
      resume: resumes,
    })
    .from(users)
    .leftJoin(applicants, eq(users?.id, applicants?.id))
    .leftJoin(resumes, eq(applicants?.id, resumes?.applicantId))
    .where(eq(users?.id, userId))
    .limit(1); // Object based projection

  // If no user is found, combinedData will be undefined
  if (!combinedData || !combinedData?.user) {
    return null;
  }

  const { user, applicant, resume } = combinedData;

  return {
    name: user?.name,
    email: user?.email,
    phoneNumber: user?.phoneNumber ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    location: applicant?.location ?? "",
    dateOfBirth: applicant?.dateOfBirth
      ? new Date(applicant?.dateOfBirth).toISOString().split("T")[0]
      : "",
    nationality: applicant?.nationality ?? "",
    gender: applicant?.gender ?? undefined,
    maritalStatus: applicant?.maritalStatus ?? undefined,
    education: applicant?.education ?? undefined,
    experience: applicant?.exprience ?? "",
    websiteUrl: applicant?.websiteUrl,
    biography: applicant?.biography,
    resumeUrl: resume?.fileUrl ?? "",
    resumeName: resume?.fileName ?? "",
    resumeSize: resume?.fileSize ?? undefined,
  };
}

export type ApplicantProfileType = NonNullable<
  Awaited<ReturnType<typeof getApplicantProfileData>>
>;

export async function getAppliedJobsForApplicant(userId: number) {
  const applications = await db
    .select({
      application: jobApplications,
      job: jobs,
      employer: employers,
    })
    .from(jobApplications)
    .innerJoin(jobs, eq(jobs?.id, jobApplications?.jobId))
    .leftJoin(employers, eq(employers?.id, jobs?.employerId))
    .where(eq(jobApplications?.applicantId, userId))
    .orderBy(desc(jobApplications?.appliedAt));

  return applications;
}
