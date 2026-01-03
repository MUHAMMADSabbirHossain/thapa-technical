"use server";

import db from "@/config/db";
import { getCurrentUser } from "./auth.queries";
import { employers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmployerProfileData } from "@/features/employers/employers.schema";

// const organizationTypeOptions = [
//   "development",
//   "design",
//   "marketing",
//   "others",
// ] as const;
// type OrganizationType = (typeof organizationTypeOptions)[number];

// const teamSizeOptions = [
//   "just me",
//   "2-10",
//   "11-50",
//   "51-100",
//   "101-500",
//   "501-1000",
//   "1001+",
// ] as const;
// type TeamSizeType = (typeof teamSizeOptions)[number];

// interface IFormInput {
//   username: string;
//   email: string;
//   name: string;
//   description: string;
//   yearOfEstablishment: string;
//   location: string;
//   websiteUrl: string;
//   organizationType: OrganizationType;
//   teamSize: TeamSizeType;
// }

export const updateEmployerProfileAction = async (
  data: EmployerProfileData
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser?.role !== "employer") {
      return { status: "error", message: "Unauthorized" };
    }

    const {
      name,
      description,
      yearOfEstablishment,
      location,
      websiteUrl,
      organizationType,
      teamSize,
    } = data;

    const updatedEmployer = await db
      .update(employers)
      .set({
        name,
        description,
        websiteUrl,
        location,
        yearOfEstablishment: yearOfEstablishment
          ? parseInt(yearOfEstablishment)
          : null,
        organizationType,
        teamSize,
      })
      .where(eq(employers?.id, currentUser?.id));
    console.log(updatedEmployer);

    return {
      status: "success",
      message: "Employer profile updated successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    };
  }
};
