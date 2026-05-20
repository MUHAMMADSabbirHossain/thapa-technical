"use server";

import { getCurrentUser } from "@/features/auth/server/auth.queries";
import {
  applicantSettingsSchema,
  ApplicantSettingsSchema,
} from "../applicant.schema";
import db from "@/config/db";
import { applicants, resumes, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function createApplicantProfile(data: ApplicantSettingsSchema) {
  try {
    console.log("data: ", data);

    const user = await getCurrentUser();

    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }

    const { data: validatedData, error } =
      applicantSettingsSchema.safeParse(data);

    if (error) {
      // Return the very first zod validation error message
      return { status: "error", message: error?.issues[0].message };
    }

    const {
      name,
      phoneNumber,
      avatarUrl,
      location,
      dateOfBirth,
      nationality,
      gender,
      maritalStatus,
      education,
      experience,
      websiteUrl,
      biography,
      resumeUrl,
      resumeName,
      resumeSize,
    } = validatedData;

    await db.transaction(async (tx) => {
      // 1. update the user's table
      await tx
        .update(users)
        .set({ name, phoneNumber, avatarUrl })
        .where(eq(users?.id, user?.id));

      await tx.insert(applicants).values({
        id: user?.id, // Foreign key & primary key
        location,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        nationality,
        gender,
        maritalStatus,
        education,
        experience,
        websiteUrl,
        biography,
      });

      if (resumeName && resumeUrl) {
        await tx.insert(resumes).values({
          applicantId: user?.id,
          fileUrl: resumeUrl,
          fileName: resumeName,
          fileSize: resumeSize,
        });
      }
    });

    return { status: "success", message: "Profile created successfully" };
  } catch (error) {
    console.error("Create profile error: ", error);

    return {
      status: "error",
      message: "Failed to create profile. Please try again.",
    };
  }
}
