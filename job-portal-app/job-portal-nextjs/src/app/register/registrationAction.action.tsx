"use server";

import db from "@/config/db";
import { applicants, employers, users } from "@/drizzle/schema";
import {
  RegisterUserData,
  registerUserSchema,
} from "@/features/auth/server/auth.schema";
import { createSessionAndSetCookies } from "@/features/auth/server/use-cases/sessions";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";

// export const registrationAction = async (formData: FormData) => {
//   console.log(Object.fromEntries(formData.entries()));

//   const { name, userName, email, password, confirmPassword, role } =
//     Object.fromEntries(formData.entries());
// };

export const registrationAction = async (data: RegisterUserData) => {
  try {
    const { data: validatedData, error } = registerUserSchema.safeParse(data);

    if (error) return { status: "error", message: error?.issues[0].message };

    const { name, userName, email, password, role } = validatedData;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users?.email, email), eq(users?.userName, userName)));

    if (user) {
      if (user?.email === email)
        return { status: "error", message: "email already exists" };
      else return { status: "error", message: "username already exists" };
    }

    const hashedPassword = await argon2.hash(password);

    await db.transaction(async (trx) => {
      const [result] = await trx.insert(users).values({
        name,
        userName,
        email,
        password: hashedPassword,
        role,
      });
      console.log(result);

      if (role === "applicant") {
        await trx.insert(applicants).values({
          id: result?.insertId,
        });
      } else {
        await trx.insert(employers).values({
          id: result?.insertId,
        });
      }

      await createSessionAndSetCookies(result?.insertId, trx);
    });

    return {
      status: "success",
      message: "registration completed successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "unknown error occurred! Please try again later.",
    };
  }
};
