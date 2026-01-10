import z from "zod";

export const organizationTypes = [
  "development",
  "design",
  "education",
  "healthcare",
  "marketing",
  "legal",
  "real estate",
  "others",
] as const;

export const teamSizes = [
  "1",
  "2-10",
  "11-50",
  "51-100",
  "101-500",
  "501-1000",
  "1001+",
] as const;

export const employerProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters long")
    .max(255, "Company name must be at most 255 characters long"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description must be at most 2000 characters long"),

  organizationType: z.enum(organizationTypes, {
    error: "Please select a valid organization type",
  }),

  teamSize: z.enum(teamSizes, {
    error: "Please select a valid team size",
  }),

  yearOfEstablishment: z
    .string()
    .trim()
    .regex(/^[0-9]{4}$/, "Please enter a valid 4-digit year")
    .refine(
      (year) => {
        const yearNum = parseInt(year);
        const currentYear = new Date().getFullYear();
        return yearNum >= 1800 && yearNum <= currentYear;
      },
      { message: "Please enter a valid year between 1800 and current year" }
    ),

  websiteUrl: z
    .url("Please enter a valid URL (e.g., https://example.com)")
    .trim()
    .max(500, "Website URL must be at most 500 characters long")
    .optional()
    .or(z.literal("")), // It allows empty string as a valid input value because zod's optional() doesn't consider empty string as a valid input value. in forms, we usually have empty string for optional fields instead of undefined. if we don't do this, then empty string will be considered as invalid input

  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters long")
    .max(255, "Location must be at most 255 characters long")
    .optional()
    .or(z.literal("")),

  avatarUrl: z.url("Please enter a valid URL (e.g., https://example.com)"),
  bannerImageUrl: z
    .url("Please enter a valid URL (e.g., https://example.com)")
    .optional()
    .or(z.literal("")),
});

export type EmployerProfileData = z.infer<typeof employerProfileSchema>;
