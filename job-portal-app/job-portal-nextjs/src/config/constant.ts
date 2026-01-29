import {
  Bookmark,
  Briefcase,
  LayoutDashboard,
  LucideIcon,
  Plus,
  Search,
  Settings,
} from "lucide-react";

export const SESSION_LIFETIME = 30 * 24 * 60 * 60;
export const SESSION_REFRESH_TIME = SESSION_LIFETIME / 2;

export const SALARY_CURRENCY = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "INR",
  "NPR",
  "PKR",
  "BDT",
] as const;

export const SALARY_PERIOD = [
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;

export const JOB_TYPE = ["remote", "hybrid", "on-site"] as const;

export const WORK_TYPE = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "freelance",
] as const;

export const JOB_LEVEL = [
  "internship",
  "entry level",
  "junior",
  "mid level",
  "senior level",
  "lead",
  "manager",
  "director",
  "executive",
] as const;

export const MINIMUM_EDUCATION = [
  "none",
  "high school",
  "undergraduate",
  "masters",
  "phd",
] as const;

// Navigation Types
export interface NavItem {
  name: string;
  icon: LucideIcon;
  href: string;
  exact?: boolean;
  badge?: number | "dynamic";
}

// Applicant Dashboard Navigation Items
export const applicantNavItems: NavItem[] = [
  {
    name: "Home",
    icon: LayoutDashboard,
    href: "/dashboard",
    exact: true, // Exact match only for home
  },
  {
    name: "Find Jobs",
    icon: Search,
    href: "/dashboard/jobs",
  },
  {
    name: "Applied",
    icon: Briefcase,
    href: "/dashboard/applications",
    badge: "dynamic", // Will show count of applied jobs
  },
  {
    name: "Save Jobs",
    icon: Bookmark,
    href: "/dashboard/saved-jobs",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export const employerNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/employer-dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Create Job",
    href: "/employer-dashboard/jobs/create",
    icon: Plus,
  },
  {
    name: "My Jobs",
    href: "/employer-dashboard/jobs",
    icon: Briefcase,
  },
  {
    name: "Settings",
    href: "/employer-dashboard/settings",
    icon: Settings,
  },
];
