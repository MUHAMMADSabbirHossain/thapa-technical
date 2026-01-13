import React from "react";
import { JobCardProps } from "../jobs/types/job.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, MapPin, Pencil, Trash2 } from "lucide-react";

const EmployerJobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="hover:shadow-md transition cursor-pointer">
      <CardContent className="space-y-3 p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{job?.title}</h3>

          <div className="flex gap-2">
            <Button size={"icon"} variant={"ghost"}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size={"icon"} variant={"ghost"}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <Badge>{job?.jobType}</Badge>
          <Badge>{job?.workType}</Badge>
          <Badge>{job?.joblevel}</Badge>
        </div>

        {job?.location && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {job?.location}
          </p>
        )}

        {job?.minSalary && job?.maxSalary && (
          <p className="text-sm font-medium">
            {job?.salaryCurrency} {job?.minSalary} - {job?.maxSalary}/
            {job?.salaryPeriod}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployerJobCard;
