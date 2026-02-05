import Link from "next/link";
import { JobCardType } from "../server/jobs.queries";
import Image from "next/image";
import { Banknote, Briefcase, Clock, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: JobCardType;
}

const JobCard = ({ job }: JobCardProps) => {
  // Helper to format salary safely
  const formatSalary = () => {
    if (!job?.minSalary || !job?.maxSalary) return "No Disclosed";

    return `${job?.salaryCurrency} ${job?.minSalary.toLocaleString()} - ${job?.maxSalary.toLocaleString()}`;
  };

  return (
    <Link
      href={`/dashboard/jobs/${job?.id}`}
      className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md"
    >
      {/* Header: Logo & Title */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3">
          {/* Company Logo with fallback */}
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            {job?.companyLogo ? (
              <Image
                src={job?.companyLogo}
                alt={job?.companyName || "Company Logo"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 font-bold text-gray-400">
                {job?.companyName?.slice(0, 2).toUpperCase() || "CO"}
              </div>
            )}
          </div>

          <div>
            <h3 className="max-w-[180px] truncate font-semibold text-gray-900 group-hover:text-blue-600">
              {job?.title}
            </h3>
            <p className="text-sm text-gray-500"> {job?.companyName}</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
        <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
          <MapPin className="h-3 w-3" />
          {job?.location || "Remote"}
        </div>

        <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
          <Briefcase className="h-3 w-3" />
          {job?.workType?.replace("-", " ").toUpperCase() || "Full time"}
        </div>

        <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2">
          <Banknote className="h-3 w-3" />
          {formatSalary()}
        </div>
      </div>

      {/* Footer: Time Ago */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Posted{" "}
          {formatDistanceToNow(new Date(job?.createdAt), { addSuffix: true })}
        </span>

        <span className="font-semibold text-blue-600 group-hover:underline">
          View Details &rarr;
        </span>
      </div>
    </Link>
  );
};

export default JobCard;
