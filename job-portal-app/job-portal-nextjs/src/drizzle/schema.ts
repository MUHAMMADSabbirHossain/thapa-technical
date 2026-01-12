import {
  JOB_LEVEL,
  JOB_TYPE,
  MINIMUM_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/config/constant";
import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  year,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int().autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  role: mysqlEnum("role", ["admin", "applicant", "employer"]).default(
    "applicant"
  ),
  phoneNumber: varchar("phone_number", { length: 255 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at").notNull().defaultNow().onUpdateNow(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users?.id, { onDelete: "cascade" }),
  userAgent: text("user_agent").notNull(),
  ip: varchar("ip", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const employers = mysqlTable("employers", {
  id: int("id")
    .primaryKey()
    .references(() => users?.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  // avatarUrl: text("avatart_url"),
  bannerImageUrl: text("banner_image_url"),
  organizationType: varchar("organization_type", { length: 100 }),
  teamSize: varchar("team_size", { length: 50 }),
  yearOfEstablishment: year("year_of_establishment"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at").notNull().defaultNow().onUpdateNow(),
});

export const applicants = mysqlTable("applicants", {
  id: int("id")
    .primaryKey()
    .references(() => users?.id, { onDelete: "cascade" }),
  biography: text("biography"),
  dateOfBirth: datetime("date_of_birth"),
  nationality: varchar("nationality", { length: 100 }),
  maritalStatus: mysqlEnum("merital_status", ["single", "married", "divorced"]),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  education: mysqlEnum("education", [
    "none",
    "high school",
    "undergraduate",
    "masters",
    "phd",
  ]),
  exprience: text("exprience"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at").notNull().defaultNow().onUpdateNow(),
});

export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  employerId: int("employer_id")
    .notNull()
    .references(() => employers?.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  tags: text("tags"),
  minSalary: int("min_salary"),
  maxSalary: int("max_salary"),
  salaryCurrency: mysqlEnum("salary_currency", SALARY_CURRENCY),
  salaryPeriod: mysqlEnum("salary_period", SALARY_PERIOD),
  location: varchar("location", { length: 255 }),
  jobType: mysqlEnum("job_type", JOB_TYPE),
  workType: mysqlEnum("work_type", WORK_TYPE),
  jobLevel: mysqlEnum("job_level", JOB_LEVEL),
  experience: text("experience"),
  minEducation: mysqlEnum("min_education", MINIMUM_EDUCATION),
  isFeatured: boolean("is_featured").default(false).notNull(),
  expiredAt: date("expired_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at").notNull().defaultNow().onUpdateNow(),
});

export const jobsRelations = relations(jobs, ({ one }) => ({
  // Each job belongs to one employer
  employer: one(employers, {
    fields: [jobs?.employerId],
    references: [employers?.id],
  }),
}));

// relations(TABLE_NAME, (helpers) => ({
//   relationName: relationType(OTHER_TABLE, {
//     fields: [CURRENT_TABLE.column],
//     references: [OTHER_TABLE.column],
//   }),
// }));

// Relations definations
export const userRelations = relations(users, ({ one, many }) => ({
  // One user can have one employer profile (if role is employer)
  employer: one(employers, {
    fields: [users?.id],
    references: [employers?.id],
  }),
  // One user can have one applicant profile (if role is applicant)
  applicant: one(applicants, {
    fields: [users?.id],
    references: [applicants?.id],
  }),
  // One user can have many sessions
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  // Each session belongs to one user
  user: one(users, {
    fields: [sessions?.userId],
    references: [users?.id],
  }),
}));
