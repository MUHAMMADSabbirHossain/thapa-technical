export const SESSION_LIFETIME = 30 * 24 * 60 * 60;
export const SESSION_REFRESH_TIME = SESSION_LIFETIME / 2;

export const SAlARY_CURRENCY = [
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

export const SAlARY_PERIOD = [
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
