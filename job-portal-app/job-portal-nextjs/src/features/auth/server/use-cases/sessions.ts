import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "./locaion";
import db from "@/config/db";
import { sessions } from "@/drizzle/schema";
import { SESSION_LIFETIME } from "@/config/constant";

type CreateSessionData = {
  token: string;
  userId: number;
  userAgent: string;
  ip: string;
};

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex").normalize();
};

// generates a 256-bit cryptographically secure random string token
// <Buffer 4f 8a 9b 12 ... > (raw binary, not readable)
// Converts that binary data into a hexadecimal string.("4f8a9b12d...")
// This ensure the string is in a consistent Unicode normalization form (usually NFC).

const createUserSession = async ({
  token,
  userId,
  userAgent,
  ip,
}: CreateSessionData) => {
  const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

  const [result] = await db.insert(sessions).values({
    id: hashedToken,
    userId,
    expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
    ip,
    userAgent,
  });

  return result;
};

export const createSessionAndSetCookies = async (userId: number) => {
  const token = generateSessionToken();
  const ip = await getIPAddress();
  const headersList = await headers();

  await createUserSession({
    token,
    userId,
    userAgent: headersList.get("user-agent") || "",
    ip,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_LIFETIME,
  });
};
