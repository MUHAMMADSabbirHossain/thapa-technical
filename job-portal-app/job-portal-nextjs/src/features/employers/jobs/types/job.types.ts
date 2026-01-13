import {
  JobLevel,
  JobType,
  MinEducation,
  SalaryCurrency,
  SalaryPeriod,
  WorkType,
} from "../../components/employer-job-form";

export interface Job {
  id: number;
  title: string;
  description: string;
  employerId: number;
  jobType: JobType;
  workType: WorkType;
  joblevel: JobLevel;
  location: string | null;
  tags: string;
  minSalary: number | null;
  maxSalary: number | null;
  salaryCurrency: SalaryCurrency | null;
  salaryPeriod: SalaryPeriod | null;
  minEducation: MinEducation | null;
  experience: string | null;

  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  //   deletedAt: Date | null;
}

export interface JobCardProps {
  job: Job;
  onEdit?: (jobId: number) => void;
  onDelete?: (jobId: number) => void;
}
