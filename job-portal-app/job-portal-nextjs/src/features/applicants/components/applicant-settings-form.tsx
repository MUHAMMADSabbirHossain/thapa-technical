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
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ApplicantProfileData>();

  async function onSubmit(data: ApplicantProfileData) {
    console.log("Saving Data: ", data);

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
            <div className="flex items-center gap-6 mb-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("fullName")}
                    placeholder="John Doe"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    placeholder="john@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("phone")}
                    placeholder="+1 (123) 456-7890"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("location")}
                    placeholder="New York, USA"
                    className="pl-10"
                  />
                </div>
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
                    className="pl-10"
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("nationality")}
                    className="pl-10"
                    type="text"
                    placeholder="e.g., Nepali"
                  />
                </div>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
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

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="education">Highest Education</Label>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field?.onChange} value={field?.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="bachelor">Bachelor</SelectItem>
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("experience")}
                  placeholder="e.g., 2 years"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Portfolio Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("websiteUrl")}
                  placeholder="e.g., https://example.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                {...register("biography")}
                className="min-h-[120px]"
                placeholder="Tell us about yourself..."
              />
              <p className="text-[10px] text-right text-muted-foreground">
                Max 500 characters
              </p>
            </div>

            <Separator />

            {/* Resume upload (visual only) */}
            <div className="space-y-4">
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
