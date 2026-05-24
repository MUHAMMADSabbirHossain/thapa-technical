"use server";

import { getCurrentUser } from "@/features/auth/server/auth.queries";
import {
  applicantSettingsSchema,
  ApplicantSettingsSchema,
} from "../applicant.schema";
import db from "@/config/db";
import { applicants, resumes, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const saveApplicantProfile = async (data: ApplicantSettingsSchema) => {
  try {
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
      // 1. Update the users table (Always an update since the user must exist to be logged in)
      await tx
        .update(users)
        .set({
          name,
          phoneNumber,
          avatarUrl,
        })
        .where(eq(users?.id, user?.id));

      // 2. Upsert applicants table
      const existingApplicant = await tx
        .select()
        .from(applicants)
        .where(eq(applicants?.id, user?.id))
        .limit(1);

      const applicantData = {
        location,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
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
      };

      if (existingApplicant.length > 0) {
        // Record exists, update
        await tx
          .update(applicants)
          .set(applicantData)
          .where(eq(applicants?.id, user?.id));
      } else {
        // No record, Insert
        await tx.insert(applicants).values({
          id: user?.id, // Foreign key & primary key
          ...applicantData,
        });
      }

      // 3. Upsert resumes table
      if (resumeName && resumeUrl) {
        const existingResume = await tx
          .select()
          .from(resumes)
          .where(eq(resumes?.applicantId, user?.id))
          .limit(1);

        const resumeData = {
          fileUrl: resumeUrl,
          fileName: resumeName,
          fileSize: resumeSize,
          isPrimary: true,
        };

        if (existingResume.length > 0) {
          // Update the existing resume ID the we found
          await tx
            .update(resumes)
            .set(resumeData)
            .where(eq(resumes?.id, existingResume[0]?.id));
        } else {
          // Insert a new resume
          await tx.insert(resumes).values({
            applicantId: user?.id, // Foreign key & primary key
            ...resumeData,
          });
        }
      }
    });

    // Refresh the page so the pre-filled data updates immediately
    revalidatePath("/dashboard/settings");

    return { status: "success", message: "Profile updated successfully." };
  } catch (error) {
    console.error("Create profile error: ", error);

    return {
      status: "error",
      message: "Failed to create profile. Please try again.",
    };
  }
};

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
