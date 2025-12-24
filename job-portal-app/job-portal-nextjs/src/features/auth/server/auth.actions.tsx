"use server";

import db from "@/config/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

type LoginData = {
  email: string;
  password: string;
};

export const loginUserAction = async (data: LoginData) => {
  try {
    const { email, password } = data;

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
