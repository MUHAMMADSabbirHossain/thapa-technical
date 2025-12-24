"use server";

import db from "@/config/db";
import { users } from "@/drizzle/schema";
import argon2 from "argon2";

// export const registrationAction = async (formData: FormData) => {
//   console.log(Object.fromEntries(formData.entries()));

//   const { name, userName, email, password, confirmPassword, role } =
//     Object.fromEntries(formData.entries());
// };

export const registrationAction = async (data: {
  name: string;
  userName: string;
  email: string;
  password: string;
  role: "applicant" | "employer";
}) => {
  const { name, userName, email, password, role } = data;

  const hashedPassword = await argon2.hash(password);

  const result = await db.insert(users).values({
    name,
    userName,
    email,
    password: hashedPassword,
    role,
  });
  console.log(result);

  return result;
};
