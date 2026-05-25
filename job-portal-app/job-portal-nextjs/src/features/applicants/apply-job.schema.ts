import { z } from "zod";

export const applyJobSchema = z.object({
  jobId: z.number(),
  resumeId: z.number().min(1, "Please select a resume"),
  coverLetter: z.string().trim().optional().or(z.literal("")),
});

export type ApplyJobSchema = z.infer<typeof applyJobSchema>;
