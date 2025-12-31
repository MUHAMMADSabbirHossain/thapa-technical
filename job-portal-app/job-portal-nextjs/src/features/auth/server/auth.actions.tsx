"use server";

import db from "@/config/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import { LoginUserData, loginUserSchema } from "./auth.schema";
import {
  createSessionAndSetCookies,
  invalidateSession,
} from "./use-cases/sessions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

export const loginUserAction = async (data: LoginUserData) => {
  try {
    const { data: validatedData, error } = loginUserSchema.safeParse(data);

    if (error) return { status: "error", message: error?.issues[0].message };

    const { email, password } = validatedData;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      //   throw new Error("User not found");
      return {
        status: "error",
        message: "Invalid email or password",
      };
    }

    const isValidPassword = await argon2.verify(user?.password, password);

    if (!isValidPassword) {
      return {
        status: "error",
        message: "Invalid email or password",
      };
    }

    await createSessionAndSetCookies(user?.id);

    return {
      status: "success",
      message: "Login successful",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Unknown error occurred! Please try again later.",
    };
  }
};

// logout user
export const logoutUserAction = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return redirect("/login");

  const hashedToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");

  await invalidateSession(hashedToken);

  cookieStore.delete("session");

  return redirect("/login");
};
