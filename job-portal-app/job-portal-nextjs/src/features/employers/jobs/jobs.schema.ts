import {
  JOB_LEVEL,
  JOB_TYPE,
  MINIMUM_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";
import z from "zod";

export const jobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters long")
      .max(255, "Title must be at most 255 characters long"),
    description: z
      .string()
      .trim()
      .min(50, "Description must be at least 50 characters long")
      .max(5000, "Description must be at most 5000 characters long"),
    tags: z
      .string()
      .trim()
      .max(500, "Tags must be at most 500 characters long")
      .optional()
      .or(z.literal("")), // This field is allowd to be empty string.
    minSalary: z
      .string()
      .trim()
      .regex(/^\d+$/, "Minimum salary must be a valid number")
      .optional()
      .or(z.literal(""))
      .transform((v) => (!v ? null : parseInt(v)))
      .nullable(),
    maxSalary: z
      .string()
      .trim()
      .regex(/^\d+$/, "Maximum salary must be a valid number")
      .optional()
      .or(z.literal(""))
      .transform((v) => (!v ? null : parseInt(v)))
      .nullable(),
    salaryCurrency: z.enum(SALARY_CURRENCY, {
      error: "Please select a valid currency",
    }),
    salaryPeriod: z.enum(SALARY_PERIOD, {
      error: "Please select a valid salary period",
    }),
    location: z
      .string()
      .trim()
      .min(2, "Location must be at least 2 characters long")
      .max(255, "Location must be at most 255 characters long")
      .optional()
      .or(z.literal("")),
    jobType: z.enum(JOB_TYPE, {
      error: "Please select a valid job type",
    }),
    jobLevel: z.enum(JOB_LEVEL, {
      error: "Please select a valid job level",
    }),
    workType: z.enum(WORK_TYPE, {
      error: "Please select a valid work type",
    }),
    experience: z
      .string()
      .trim()
      .max(1000, "Experience must be at most 1000 characters long")
      .optional()
      .or(z.literal("")),
    minEducation: z
      .enum(MINIMUM_EDUCATION, {
        error: "Please select a valid education level",
      })
      .optional()
      .or(z.literal("")),
    expiresAt: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .transform((date) => (!date || date === "" ? null : date))
      .pipe(
        z
          .string()
          .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Please enter a valid date (YYYY-MM-DD)"
          )
          .refine(
            (date) => {
              const expiryDate = new Date(date); // YYYY-MM-DD 00:00:00:00
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Set time to YYYY-MM-DD 00:00:00:00

              return expiryDate >= today;
            },
            {
              message: "Expiry date must be today or in the future",
            }
          )
          .transform((date) => new Date(date))
          .nullable()
      )
      .nullable(),
  })
  .refine(
    (data) => {
      if (data?.minSalary && data?.maxSalary) {
        return data.minSalary <= data.maxSalary;
      }

      return true;
    },
    {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maxSalary"], // path is an array because Zod supports deep/nested path
    }
  )
  .refine(
    (data) => {
      const hasSalaryInfo =
        data.minSalary ||
        data.maxSalary ||
        data.salaryCurrency ||
        data.salaryPeriod;

      if (hasSalaryInfo) {
        return data?.salaryCurrency && data?.salaryPeriod;
      }

      return true;
    },
    {
      message: "Currency and period are required when salary is specified",
      path: ["salaryCurrency"],
    }
  );

export type JobFormData = z.infer<typeof jobSchema>;
