import db from "@/config/db";
import { employers, jobs, users } from "@/drizzle/schema";
import { and, desc, eq, gte, isNull, like, or, sql, SQL } from "drizzle-orm";

// 2. Define the Interface
export interface JobfilterParams {
  search?: string;
  jobType?: string;
  jobLevel?: string;
  workType?: string;
  page?: string;
  limit?: string;
}

export const getAllJobs = async (filters: JobfilterParams) => {
  const page = filters?.page ? Number(filters.page) : 1;
  const limit = filters?.limit ? Number(filters.limit) : 10;
  const offset = (page - 1) * limit;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to 00:00:00.000

  // Base Rule
  const conditions: (SQL | undefined)[] = [
    isNull(jobs.deletedAt),
    or(isNull(jobs.expiredAt), gte(jobs.expiredAt, today)),
  ];

  // search
  if (filters?.search) {
    // 1. react - mern stack react title, react, react thapa
    // % - wildcard
    // 2. company name, tags, title - LIKE() -contains
    // 3. OR

    const searchTerm = `%${filters.search}%`;

    conditions.push(
      or(
        like(jobs.title, searchTerm),
        like(employers.name, searchTerm),
        like(jobs.tags, searchTerm),
        like(jobs.location, searchTerm),
      ),
    );
  }

  if (filters?.jobType && filters?.jobType !== "all") {
    conditions.push(eq(jobs.jobType, filters.jobType as any));
  }

  if (filters?.jobLevel && filters?.jobLevel !== "all") {
    conditions.push(eq(jobs.jobLevel, filters.jobLevel as any));
  }

  if (filters?.workType && filters?.workType !== "all") {
    conditions.push(eq(jobs.workType, filters.workType as any));
  }

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
    .where(and(...conditions))
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
    .offset(offset);

  // 2. Fetch the total count for pagination math
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobs)
    .innerJoin(employers, eq(jobs?.employerId, employers?.id))
    .where(and(...conditions));

  const totalCount = Number(countResult[0]?.count || 0);

  return {
    jobs: jobsData,
    totalCount,
  };
};

// AUTOMATIC TYPE EXPORT
// This creates a type based on EXACTLY what getAllJobs returns.
// If you change the query, the type will automatically update.
export type JobCardType = Awaited<
  ReturnType<typeof getAllJobs>
>["jobs"][number];

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
export type JobDetailsType = Awaited<ReturnType<typeof getJobById>>;
