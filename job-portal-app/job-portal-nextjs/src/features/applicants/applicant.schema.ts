import z from "zod";

export const GENDER_OPTIONS = ["male", "female", "other"] as const;
export const MERITAL_STATUS_OPTIONS = [
  "single",
  "married",
  "divorced",
] as const;
export const EDUCATION_OPTIONS = [
  "none",
  "high school",
  "undergraduate",
  "masters",
  "phd",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

export const applicantSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(2, "Location is required"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  nationality: z.string().min(2, "Nationality is required"),
  gender: z.enum(GENDER_OPTIONS, {
    error: () => "Please select a gender",
  }),
  meritalStatus: z.enum(MERITAL_STATUS_OPTIONS, {
    error: () => "Please select a merital status",
  }),
  education: z.enum(EDUCATION_OPTIONS, {
    error: () => "Please select an education",
  }),
  experience: z.string().min(1, "Experience is required"),
  websiteUrl: z.url("Invalid URL").optional().or(z.literal("")),
  biography: z
    .string()
    .max(500, "Biography must be less than 500 characters")
    .optional(),
  resume: z
    .any()
    .refine((files) => files?.length === 1, "Resume is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB",
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf format is supported",
    ),
});

export type ApplicantSettingsSchema = z.infer<typeof applicantSettingsSchema>;
