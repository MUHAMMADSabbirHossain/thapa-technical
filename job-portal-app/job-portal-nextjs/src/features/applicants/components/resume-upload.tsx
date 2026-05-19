"use client";

import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { useDropzone } from "@uploadthing/react";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";

interface ResumeUploadProps {
  value?: string;
  onChange?: (url: string, fileName: string, fileSize: number) => void;
  className?: string;
}

function ResumeUpload({ value, onChange, className }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      console.log("res pdf: ", res);

      if (res && res[0]) {
        const file = res[0];
        // Pass both url and name back to the form
        onChange?.(file?.ufsUrl, file?.name, file?.size);
        setFileName(file?.name);
        toast.success("Resume uploaded successfully");
      }

      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  async function handleFileSelect(files: File[]) {
    const file = files?.[0];

    if (!file) {
      return;
    }

    if (file?.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    setIsUploading(true);

    await startUpload([file]);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  function handleRemove(e: MouseEvent) {
    e.stopPropagation();
    onChange?.("", "", 0);
    setFileName(null);
  }

  // If a resume is already uploaded
  if (value) {
    return (
      <div
        className={
          (cn(
            "border border-border rounded-lg p-4 flex items-center justify-between bg-blue-50/50",
          ),
          className)
        }
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground line-clamp-1">
              {fileName || "Uploaded Resume.pdf"}
            </p>
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View Document
            </a>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Upload State UI
  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition cursor-pointer",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        isUploading && "opacity-50 pointer-events-none",
        className,
      )}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium">Uploading securely...</p>
        </div>
      ) : (
        <>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>
          <h4 className="font-medium text-sm">
            <span className="text-primary">Browse file</span> or drop here
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Only PDF format available. Max file size 5 MB.
          </p>
        </>
      )}
    </div>
  );
}

export default ResumeUpload;
