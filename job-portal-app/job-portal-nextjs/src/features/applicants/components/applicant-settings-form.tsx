"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Calendar,
  Flag,
  Globe,
  Loader,
  Mail,
  Map,
  Phone,
  UploadCloud,
  User,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  applicantSettingsSchema,
  ApplicantSettingsSchema,
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  MERITAL_STATUS_OPTIONS,
} from "../applicant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "@/components/text-editor";
import { ImageUpload } from "@/features/employers/components/employer-settings-form";
import { cn } from "@/lib/utils";
import ResumeUpload from "./resume-upload";

// Temporary Type Defination (Since Zod is removed for now)
type ApplicantProfileData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  maritalStatus: string;
  education: string;
  experience: string;
  websiteUrl: string;
  biography: string;
};

function ApplicantSettingsForm() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ApplicantSettingsSchema>({
    resolver: zodResolver(applicantSettingsSchema),
    defaultValues: {
      email: "vinod@thapa.com",
    },
  });

  async function onSubmit(data: ApplicantSettingsSchema) {
    console.log("Saving Data: ", data);
    // console.log("Resume file: ", data?.resume?.[0]);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Profile updated successfully");
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* --- Section 1: Basic info --- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Basic Information
            </CardTitle>
            <CardDescription>
              This is how employers will see you.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* <div className="flex items-center gap-6 mb-6">
              <div className="h-24 w-24 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-gray-400 cursor-pointer transition">
                <div className="text-center space-y-1">
                  <UploadCloud className="h-6 w-6 mx-auto text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground block">
                    Upload Photo
                  </span>
                </div>
              </div>
              <div>
                <p>
                  Max file size is 5MB. Minimum dimensions: 150x150 (pixels)
                </p>
                <p>Suitable files are .jpg and .png</p>
              </div>
            </div> */}

            <div className="flex items-center gap-6 mb-6">
              <div className="">
                <div className="text-center space-y-1">
                  <Controller
                    name="avatarUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <Label htmlFor="avatarUrl">Upload Logo</Label>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          className={cn(
                            fieldState.error &&
                              "ring-1 ring-destructive/50 rounded-full",
                            "h-34 w-34",
                          )}
                        />

                        {fieldState.error && (
                          <p className="text-destructive text-sm">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("name")}
                    placeholder="John Doe"
                    className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    placeholder="john@example.com"
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("phoneNumber")}
                    placeholder="+1 (123) 456-7890"
                    className={`pl-10 ${errors.phoneNumber ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-destructive text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("location")}
                    placeholder="New York, USA"
                    className={`pl-10 ${errors.location ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.location && (
                  <p className="text-destructive text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Section 2: Professional Details --- */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>
              Add your professional information to showcase your skills and
              experience.
            </CardDescription>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("dateOfBirth")}
                    className={`pl-10 ${errors.dateOfBirth ? "border-destructive" : ""}`}
                    type="date"
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-destructive text-sm">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("nationality")}
                    className={`pl-10 ${errors.nationality ? "border-destructive" : ""}`}
                    type="text"
                    placeholder="e.g., Nepali"
                  />
                </div>
                {errors.nationality && (
                  <p className="text-destructive text-sm">
                    {errors.nationality.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field?.onChange}
                      value={field?.value}
                    >
                      <SelectTrigger
                        className={`${errors.gender ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-destructive text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meritalStatus">Merital Status</Label>
                <Controller
                  name="meritalStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field?.onChange}
                      value={field?.value}
                    >
                      <SelectTrigger
                        className={`${errors.meritalStatus ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select Merital Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MERITAL_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.meritalStatus && (
                  <p className="text-destructive text-sm">
                    {errors.meritalStatus.message}
                  </p>
                )}
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        {/* --- Section 3: Personal Profile --- */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Profile</CardTitle>
            <CardDescription>
              Highlight your skills and experience.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="education">Highest Education</Label>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field?.onChange}
                      value={field?.value}
                    >
                      <SelectTrigger
                        className={`${errors.education ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select Education" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.education && (
                  <p className="text-destructive text-sm">
                    {errors.education.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("experience")}
                    placeholder="e.g., 2 years"
                    className={`pl-10 ${errors.experience ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.experience && (
                  <p className="text-destructive text-sm">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Portfolio Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("websiteUrl")}
                  placeholder="e.g., https://example.com"
                  className={`pl-10 ${errors.websiteUrl ? "border-destructive" : ""}`}
                />
              </div>
              {errors.websiteUrl && (
                <p className="text-destructive text-sm">
                  {errors.websiteUrl.message}
                </p>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                {...register("biography")}
                className={`min-h-[120px] ${errors.biography ? "border-destructive" : ""}`}
                placeholder="Tell us about yourself..."
              />
              {errors.biography && (
                <p className="text-destructive text-sm">
                  {errors.biography.message}
                </p>
              )}
              <p className="text-[10px] text-right text-muted-foreground">
                Max 500 characters
              </p>
            </div> */}

            <div className="space-y-2">
              <Controller
                name="biography"
                control={control}
                render={({
                  field,
                  fieldState,
                }: {
                  field: any;
                  fieldState: any;
                }) => (
                  <div className="space-y-2">
                    <Label htmlFor="biography">Biography</Label>
                    <Tiptap content={field?.value} onChange={field.onChange} />

                    {fieldState?.error && (
                      <p className="text-destructive text-sm">
                        {fieldState?.error?.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Separator />

            {/* Resume upload (visual only) */}
            {/* <div className="space-y-4">
              <Label htmlFor="resume" className="text-base">
                Resume / CV
              </Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <h4 className="font-medium text-sm">
                  Click to upload or drag andd drop
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF (Max 2MB)
                </p>
              </div>
            </div> */}

            <div className="space-y-4">
              <Label htmlFor="resume" className="text-base">
                Resume / CV
              </Label>

              <Controller
                name="resumeUrl"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <ResumeUpload
                      value={field?.value}
                      onChange={(url, name, size) => {
                        // We update both fields in React Hook from when upload finisheds
                        field.onChange(url);
                        setValue("resumeName", name, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("resumeSize", size, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />

                    {fieldState.error && (
                      <p className="text-destructive text-sm mt-2">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "saving..." : "Save changes"}
          </Button>

          {!isDirty && (
            <p className="text-sm text-muted-foreground italic">
              No changes to save
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default ApplicantSettingsForm;
