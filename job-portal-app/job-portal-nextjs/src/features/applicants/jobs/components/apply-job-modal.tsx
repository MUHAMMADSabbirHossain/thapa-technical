"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { applyJobSchema, ApplyJobSchema } from "../../apply-job.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { applyForJobAction } from "../actions/apply-job.action";

interface ApplyJobModalProps {
  jobId: number;
  jobTitle: string;
  hasApplied: boolean;
  resumes: { id: number; fileName: string }[];
}

function ApplyJobModal({
  jobId,
  jobTitle,
  hasApplied,
  resumes,
}: ApplyJobModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ApplyJobSchema>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      jobId,
      resumeId: resumes.length > 0 ? resumes[0].id : 0,
      coverLetter: "",
    },
  });

  const onSubmit = async (data: ApplyJobSchema) => {
    console.log(data);

    try {
      const res = await applyForJobAction(data);

      if (res?.status === "success") {
        toast.success(res?.message);
        setIsOpen(false);
        reset();
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (hasApplied) {
    return (
      <Button
        disabled
        className="w-full sm:w-0 bg-gray-100 text-gray-500 cursor-not-allowed"
      >
        Already Applied
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto gap-2">
          Apply Now <ArrowRight className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for: {jobTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>
              Choose Resume <span className="text-destructive">*</span>
            </Label>
            {resumes.length > 0 ? (
              <p className="text-sm text-destructive">
                Please upload a resume in your profile settings first.
              </p>
            ) : (
              <Controller
                name="resumeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={
                      field?.value > 0 ? field?.value.toString() : undefined
                    }
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger
                      className={errors.resumeId ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Choose resume" />
                    </SelectTrigger>

                    <SelectContent>
                      {resumes.map((resume) => (
                        <SelectItem
                          key={resume.id}
                          value={resume.id.toString()}
                        >
                          {resume?.fileName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.resumeId && (
              <p className="text-sm text-destructive">
                {errors.resumeId.message}
              </p>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-2">
            <Label>Cover Letter</Label>

            <Textarea
              {...register("coverLetter")}
              placeholder="Write down your biography here. Let the employers know who you are..."
              className="min-h-[150px]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || resumes.length === 0}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Applying..." : "Apply Now"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ApplyJobModal;
