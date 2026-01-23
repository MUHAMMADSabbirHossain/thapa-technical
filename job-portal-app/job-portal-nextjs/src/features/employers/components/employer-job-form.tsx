"use client";

import Tiptap from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JOB_LEVEL,
  JOB_TYPE,
  MINIMUM_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";
import { cn } from "@/lib/utils";
import {
  Award,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Loader,
  MapPin,
  Tag,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { JobFormData, jobSchema } from "../jobs/jobs.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createJobAction,
  updateJobAction,
} from "@/features/server/jobs.actions";

export type JobType = (typeof JOB_TYPE)[number];
export type WorkType = (typeof WORK_TYPE)[number];
export type JobLevel = (typeof JOB_LEVEL)[number];
export type SalaryCurrency = (typeof SALARY_CURRENCY)[number];
export type SalaryPeriod = (typeof SALARY_PERIOD)[number];
export type MinEducation = (typeof MINIMUM_EDUCATION)[number];

/* interface JobFormValues {
  title: string;
  description: string;
  tags?: string;
  jobType?: JobType;
  workType?: WorkType;
  jobLevel?: JobLevel;
  location?: string;
  salaryCurrency?: SalaryCurrency;
  salaryPeriod?: SalaryPeriod;
  minSalary?: number;
  maxSalary?: number;
  experience?: string;
  minEducation?: MinEducation;
  isFeatured: boolean;
  expiredAt?: string; // YYYY-MM-DD (HTML date input)
} */

interface JobPostFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

const JobForm = ({ initialData, isEditMode = false }: JobPostFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    // defaultValues: {
    //   jobType: "on-site",
    //   workType: "full-time",
    //   jobLevel: "internship",
    //   location: "",
    //   salaryCurrency: "USD",
    //   salaryPeriod: "monthly",
    //   experience: "",
    //   minEducation: "none",
    //   isFeatured: false,
    //   expiredAt: "",
    // },
    resolver: zodResolver(jobSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          minSalary: initialData?.minSalary?.toString(),
          maxSalary: initialData?.maxSalary?.toString(),
          // FIX: Handle Date Format
          expiredAt: initialData?.expiredAt
            ? new Date(initialData?.expiredAt).toISOString().split("T")[0]
            : "",
        }
      : {
          title: "",
          description: "",
          tags: "",
          jobType: "on-site",
          workType: "full-time",
          jobLevel: "internship",
          location: "",
          salaryCurrency: "USD",
          salaryPeriod: "monthly",
          minSalary: 0,
          maxSalary: 0,
          experience: "",
          minEducation: "none",
          isFeatured: false,
          expiredAt: "",
        },
  });
  // console.log(initialData);

  const handleFormSubmit = async (data: JobFormData) => {
    console.log(data);

    try {
      let response;

      if (isEditMode && initialData) {
        // --- UPDATE JOB ---
        response = await updateJobAction(initialData?.id, data);
      } else {
        // --- CREATE JOB ---
        response = await createJobAction(data);
      }

      if (response?.status === "success") toast.success(response?.message);
      else toast.error(response?.message);
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="w-3/4">
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="title"
                type="text"
                placeholder="e.g., Senior Frontend Developer"
                className={cn("pl-10", errors?.title && "border-destructive")}
                {...register("title")}
                aria-invalid={!!errors?.title}
              />
            </div>
            {errors?.title && (
              <p className="text-sm text-destructive">
                {errors?.title?.message}
              </p>
            )}
          </div>

          {/* Job Type, Work Type, Job Level */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="jobType"
                        className={cn(
                          "pl-10 w-full",
                          errors.jobType && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors?.jobType && (
                <p className="text-sm text-destructive">
                  {errors?.jobType?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workType">Work Type *</Label>
              <Controller
                name="workType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="workType"
                        className={cn(
                          "pl-10 w-full",
                          errors.workType && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.workType && (
                <p className="text-sm text-destructive">
                  {errors.workType.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobLevel">Job Level *</Label>
              <Controller
                name="jobLevel"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="jobLevel"
                        className={cn(
                          "pl-10 w-full",
                          errors.jobLevel && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select job level" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_LEVEL.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.jobLevel && (
                <p className="text-sm text-destructive">
                  {errors.jobLevel.message}
                </p>
              )}
            </div>
          </div>

          {/* Location and Tags */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., New York, NY or Remote"
                  className={cn(
                    "pl-10",
                    errors.location && "border-destructive",
                  )}
                  {...register("location")}
                  aria-invalid={!!errors.location}
                />
              </div>
              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tags"
                  type="text"
                  placeholder="e.g., React, TypeScript, Node.js"
                  className={cn("pl-10", errors.tags && "border-destructive")}
                  {...register("tags")}
                  aria-invalid={!!errors.tags}
                />
              </div>
              {errors.tags && (
                <p className="text-sm text-destructive">
                  {errors.tags.message}
                </p>
              )}
            </div>
          </div>

          {/* Salary Information */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Min Salary (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="minSalary"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g., 50000"
                  className={cn(
                    "pl-10",
                    errors.minSalary && "border-destructive",
                  )}
                  {...register("minSalary")}
                  aria-invalid={!!errors.minSalary}
                />
              </div>
              {errors.minSalary && (
                <p className="text-sm text-destructive">
                  {errors.minSalary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSalary">Max Salary (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="maxSalary"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g., 80000"
                  className={cn(
                    "pl-10",
                    errors.maxSalary && "border-destructive",
                  )}
                  {...register("maxSalary")}
                  aria-invalid={!!errors.maxSalary}
                />
              </div>
              {errors.maxSalary && (
                <p className="text-sm text-destructive">
                  {errors.maxSalary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryCurrency">Currency</Label>
              <Controller
                name="salaryCurrency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="salaryCurrency"
                      className={cn(
                        "w-full",
                        errors.salaryCurrency && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_CURRENCY.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.salaryCurrency && (
                <p className="text-sm text-destructive">
                  {errors.salaryCurrency.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryPeriod">Period</Label>
              <Controller
                name="salaryPeriod"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="salaryPeriod"
                      className={cn(
                        "w-full",
                        errors.salaryPeriod && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_PERIOD.map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.salaryPeriod && (
                <p className="text-sm text-destructive">
                  {errors.salaryPeriod.message}
                </p>
              )}
            </div>
          </div>

          {/* Education and Experience */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minEducation">Minimum Education (Optional)</Label>
              <Controller
                name="minEducation"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="minEducation"
                        className={cn(
                          "pl-10 w-full",
                          errors.minEducation && "border-destructive",
                        )}
                      >
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {MINIMUM_EDUCATION.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.minEducation && (
                <p className="text-sm text-destructive">
                  {errors.minEducation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiredAt">Expiry Date (Optional)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="expiredAt"
                  type="date"
                  className={cn(
                    "pl-10",
                    errors.expiredAt && "border-destructive",
                  )}
                  {...register("expiredAt")}
                  aria-invalid={!!errors.expiredAt}
                />
              </div>
              {errors.expiredAt && (
                <p className="text-sm text-destructive">
                  {errors.expiredAt.message}
                </p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">
              Experience Requirements (Optional)
            </Label>
            <div className="relative">
              <Award className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="experience"
                type="text"
                placeholder="e.g., 3+ years of React development"
                className={cn(
                  "pl-10",
                  errors.experience && "border-destructive",
                )}
                {...register("experience")}
                aria-invalid={!!errors.experience}
              />
            </div>
            {errors.experience && (
              <p className="text-sm text-destructive">
                {errors.experience.message}
              </p>
            )}
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>Job Description *</Label>
                <Tiptap
                  content={field.value}
                  onChange={(value) => field.onChange(value)}
                  // toolbarClassName="top-16"
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex items-center gap-4 pt-4 flex-wrap">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
              {isEditMode
                ? isSubmitting
                  ? "Updating..."
                  : "Update Job"
                : isSubmitting
                  ? "Creating..."
                  : "Post Job"}
            </Button>
            {!isDirty && (
              <p className="text-sm text-muted-foreground">
                No changes to save
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobForm;
