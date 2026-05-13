"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_LEVEL, JOB_TYPE, WORK_TYPE } from "@/config/constant";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function JobFilters() {
  const router = useRouter();

  const searchParams = useSearchParams();
  console.log("searchParams string: ", searchParams.toString());

  // Local state for immediate UI feedback
  const [search, setSearch] = useState<string>(
    searchParams.get("search") || "",
  );
  const [jobType, setJobType] = useState<string>(
    searchParams.get("jobType") || "",
  );
  const [jobLevel, setJobLevel] = useState<string>(
    searchParams.get("jobLevel") || "",
  );
  const [workType, setWorkType] = useState(searchParams.get("workType") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilters({ search: search });
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  function updateFilters(newParams: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    console.log("newParams: ", newParams);

    Object.entries(newParams).forEach(([key, value]) => {
      const actualValue = value?.trim();

      if (!actualValue || actualValue === "all") {
        params.delete(key);
      } else {
        params.set(key, actualValue);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    setJobLevel("");
    setJobType("");
    setSearch("");
    setWorkType("");

    const pathName = "/jobs";
    router.push(pathName);
  }

  return (
    <div>
      {/* --- Row 1: Search --- */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by title, skill or company"
          className="pl-10 h-11 bg-gray-50/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- Row 2: Filters --- */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Job Type Dropdown */}
        <Select
          value={jobType}
          onValueChange={(val) => {
            setJobType(val);
            updateFilters({ jobType: val });
          }}
        >
          <SelectTrigger className="w-[160px] h-9 text-xs">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>

            {JOB_TYPE.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Job Level Dropdown */}
        <Select
          value={jobLevel}
          onValueChange={(val) => {
            setJobLevel(val);
            updateFilters({ jobLevel: val });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Job Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {JOB_LEVEL.map((level) => (
              <SelectItem key={level} value={level}>
                {level.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Work Type Dropdown */}
        <Select
          value={workType}
          onValueChange={(val) => {
            setWorkType(val);
            updateFilters({ workType: val });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Work Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Work Types</SelectItem>
            {WORK_TYPE.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button (Only show if filters are active) */}
        {(search || jobType || jobLevel || workType) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="mr-2 h-3 w-3" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}

export default JobFilters;
