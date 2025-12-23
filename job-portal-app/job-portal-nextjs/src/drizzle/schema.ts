import {
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
  id: int().autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }).unique(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  deletedAt: timestamp("deleted_at").notNull().defaultNow().onUpdateNow(),
});
