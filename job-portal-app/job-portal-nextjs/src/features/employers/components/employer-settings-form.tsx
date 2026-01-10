"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { updateEmployerProfileAction } from "@/features/auth/server/employer.action";
import {
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Globe,
  Loader,
  Loader2,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  EmployerProfileData,
  employerProfileSchema,
  organizationTypes,
  teamSizes,
} from "../employers.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Tiptap from "@/components/text-editor";
import { UploadButton, useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ComponentProps, useState } from "react";
import { useDropzone } from "@uploadthing/react";

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

interface Props {
  initialData?: Partial<EmployerProfileData>;
}

const EmployerSettingsForm = ({ initialData }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EmployerProfileData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      organizationType: initialData?.organizationType || undefined,
      teamSize: initialData?.teamSize || undefined,
      yearOfEstablishment: initialData?.yearOfEstablishment,
      location: initialData?.location || "",
      avatarUrl: initialData?.avatarUrl || "",
      websiteUrl: initialData?.websiteUrl || "",
      bannerImageUrl: initialData?.bannerImageUrl || "",
    },

    resolver: zodResolver(employerProfileSchema),
  });

  const avatarUrl = watch("avatarUrl");

  const handleRemoveAvatar = () => {
    setValue("avatarUrl", "");
  };

  const onSubmit = async (data: EmployerProfileData) => {
    console.log(data);

    const response = await updateEmployerProfileAction(data);

    if (response?.status === "success") {
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <Card className="w-3/4">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* <div className="">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" {...register("username")} />
          </div>
          <div className="">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div> */}

          {/* <div className="border border-dashed p-2">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />{" "}
            <span>Upload Image</span>
          </div> */}

          {/* <div className="space-y-2">
            <Label>Company Logo</Label>
            {avatarUrl ? (
              <div className="flex items-center gap-2">
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size={"sm"}
                  onClick={handleRemoveAvatar}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border border-dashed p-2 rounded-xl">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    const profilePic = res[0];

                    setValue("avatarUrl", profilePic.ufsUrl, {
                      shouldDirty: true,
                    });

                    console.log("Files: ", res);

                    toast.success("Upload completed");
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                />
              </div>
            )}
          </div> */}

          <div className="grid lg:grid-cols-[1fr_4fr] gap-6">
            <Controller
              name="avatarUrl"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label>Upload Logo *</Label>

                  <ImageUpload
                    value={field?.value}
                    onChange={field?.onChange}
                    boxText={
                      "A photo larger then 400 pixels works best. Max photo size is 4MB."
                    }
                    className={cn(
                      fieldState.error &&
                        "ring-1 ring-destructive/50 rounded-lg",
                      "h-64 w-64"
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

            <Controller
              name="bannerImageUrl"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <div className="space-y-2">
                    <Label>Upload Banner Image</Label>

                    <ImageUpload
                      value={field?.value}
                      onChange={field?.onChange}
                      boxText={
                        "Banner images optimal dimension 1520*400. Supported format: .png, .jpg, .jpeg. Max photo size is 4MB."
                      }
                      className={cn(
                        fieldState?.error &&
                          "ring-1 ring-destructive/50 rounded-lg",
                        "h-64 w-64"
                      )}
                    />

                    {fieldState.error && (
                      <p className="text-destructive text-sm">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                className={`pl-10 ${
                  errors?.name?.message ? "border-destructive" : ""
                }`}
                {...register("name")}
              />
            </div>
            {errors?.name?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.name?.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Company Description *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="description"
                placeholder="Tell us about your company, what you do, and your mission..."
                className={`pl-10 min-h-[120px] resize-none ${
                  errors?.description?.message ? "border-destructive" : ""
                }`}
                {...register("description")}
              />
            </div>
            {errors?.description?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.description?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Tiptap content={field?.value} onChange={field?.onChange} />

                  {fieldState?.error?.message && (
                    <p className="text-destructive text-sm">
                      {fieldState?.error?.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* When you run const { control } = useForm(), you create a specific instance of a form. The <Controller /> component is isolated; it doesn't know which form it belongs to. Passing control={control} connects this specific input to that specific useForm hook. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="organizationType">Organization Type *</Label>
              <Controller
                name="organizationType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select
                      value={field?.value || ""}
                      onValueChange={field?.onChange}
                    >
                      <SelectTrigger
                        className={`pl-10 w-full ${
                          errors?.organizationType?.message
                            ? "border-destructive"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes?.map((type) => (
                          <SelectItem key={type} value={type}>
                            {/* {capitalizeWords(type)} */}
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors?.organizationType?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.organizationType?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size *</Label>
              <Controller
                name="teamSize"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select
                      value={field?.value || "just me"}
                      onValueChange={field?.onChange}
                    >
                      <SelectTrigger
                        className={`pl-10 w-full ${
                          errors?.teamSize?.message ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizes?.map((type) => (
                          <SelectItem key={type} value={type}>
                            {/* {capitalizeWords(type)} */}
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors?.teamSize?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.teamSize?.message}
                </p>
              )}
            </div>
          </div>

          {/* Year of Establishment and Location - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="yearOfEstablishment">
                Year of Establishment *
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="yearOfEstablishment"
                  type="text"
                  placeholder="e.g., 2020"
                  maxLength={4}
                  className={`pl-10 ${
                    errors?.yearOfEstablishment?.message
                      ? "border-destructive"
                      : ""
                  }`}
                  {...register("yearOfEstablishment")}
                />
              </div>
              {errors?.yearOfEstablishment?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.yearOfEstablishment?.message}
                </p>
              )}
            </div>

            {/* Year of Establishment and Location - Two columns */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Pune, Bangalore"
                  className={`pl-10 ${
                    errors?.location?.message ? "border-destructive" : ""
                  }`}
                  {...register("location")}
                />
              </div>
              {errors?.location?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.location?.message}
                </p>
              )}
            </div>
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="websiteUrl"
                type="url"
                placeholder="e.g., https://www.yourcompany.com"
                className={`pl-10 ${
                  errors?.websiteUrl?.message ? "border-destructive" : ""
                }`}
                {...register("websiteUrl")}
              />
            </div>
            {errors?.websiteUrl?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors?.websiteUrl?.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit">
              {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving changes..." : "Save Changes"}
            </Button>

            {!isDirty && <p className="">No changes made</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployerSettingsForm;

type ImageUploadProps = Omit<ComponentProps<"div">, "onChange"> & {
  value?: string;
  boxText?: string;
  onChange: (url: string) => void;
};

export const ImageUpload = ({
  value,
  onChange,
  className,
  boxText,
  ...props
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete(res) {
      if (res && res[0]) {
        onChange(res[0].ufsUrl);

        toast.success("Image uploaded successfully");
      }

      setIsUploading(false);
      setPreviewUrl(null);
    },
    onUploadError(error) {
      toast.error(error.message);

      setIsUploading(false);
      setPreviewUrl(null);
    },
  });

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];

    if (!file) return;

    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");

      return;
    }

    if (file?.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");

      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader?.result as string);
    reader?.readAsDataURL(file);

    setIsUploading(true);

    await startUpload([file]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setPreviewUrl(null);
  };

  if (value || previewUrl)
    return (
      <div
        className={cn(
          "overflow-hidden border-2 border-border relative group rounded-lg",
          className
        )}
        {...props}
      >
        <Image
          src={previewUrl || value || ""}
          alt="Uploaded image"
          height={200}
          width={200}
          className="w-full h-full object-cover"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="text-sm text-white font-medium">Uploading...</p>
            </div>
          </div>
        )}

        {!isUploading && (
          <div
            {...getRootProps()}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            <input {...getInputProps()} />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        )}
      </div>
    );

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        isUploading && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Upload className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          <span className="text-primary">Browse photo</span> or drop here
        </p>
        {boxText && (
          <p className="text-xs text-muted-foreground text-center px-4 max-w-xs">
            {boxText}
          </p>
        )}
      </div>
    </div>
  );
};
