import db from "@/config/db";
import { employers, jobs, users } from "@/drizzle/schema";
import { and, desc, eq, gte, isNull, or } from "drizzle-orm";

export const getAllJobs = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to 00:00:00.000

  const jobsData = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,
      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      createdAt: jobs.createdAt,
      companyName: employers.name,
      companyLogo: users.avatarUrl,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id)) // Join users to get avatarUrl
    .where(
      and(
        // isNull(jobs.deletedAt),s
        or(isNull(jobs.expiredAt), gte(jobs.expiredAt, today)),
      ),
    )
    .orderBy(desc(jobs.createdAt));

  return jobsData;
};

// AUTOMATIC TYPE EXPORT
// This creates a type based on EXACTLY what getAllJobs returns.
// If you change the query, the type will automatically update.
export type JobCardType = Awaited<ReturnType<typeof getAllJobs>>[number];

export const getJobById = async (jobId: number) => {
  const job = await db
    .select({
      // Basic Info
      id: jobs.id,
      title: jobs.title,
      description: jobs.description, // Full HTML description
      tags: jobs.tags,

      // Salary Details
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,

      // Job Meta data (Crucial for sidebar)
      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      jobLevel: jobs.jobLevel,
      experience: jobs.experience,
      minEducation: jobs.minEducation,

      // Timestamps
      createdAt: jobs.createdAt,
      expiredAt: jobs.expiredAt,
      deletedAt: jobs.deletedAt,

      // Employer Info (Joined)
      companyLogo: users.avatarUrl,
      companyName: employers.name,
      companyBio: employers.description,
      companyWebsite: employers.websiteUrl,
      companyLocation: employers.location,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(eq(jobs.id, jobId)) // Filter by job ID
    .limit(1); // Only want one result

  return job[0];
};

// Create the Type for the Details Page
