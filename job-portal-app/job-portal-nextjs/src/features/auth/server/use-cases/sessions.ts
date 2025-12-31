import { cookies, headers } from "next/headers";
import crypto from "crypto";
import { getIPAddress } from "./locaion";
import db from "@/config/db";
import { sessions, users } from "@/drizzle/schema";
import { SESSION_LIFETIME, SESSION_REFRESH_TIME } from "@/config/constant";
import { eq } from "drizzle-orm";

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

export const validateSessionAndGetUser = async (session: string) => {
  const hashedToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");

  const [user] = await db
    .select({
      id: users?.id,
      name: users?.name,
      email: users?.email,
      role: users?.role,
      phoneNumber: users?.phoneNumber,
      session: {
        id: sessions?.id,
        expiresAt: sessions?.expiresAt,
        ip: sessions?.ip,
        userAgent: sessions?.userAgent,
      },
    })
    .from(sessions)
    .where(eq(sessions?.id, hashedToken))
    .innerJoin(users, eq(users?.id, sessions?.userId));

  // if session not found
  if (!user) return null;

  // if session expired
  if (Date.now() >= user?.session?.expiresAt?.getTime()) {
    await invalidateSession(user?.session?.id);

    return null;
  }

  // if session is about to expire
  if (
    Date.now() >=
    user?.session?.expiresAt?.getTime() - SESSION_REFRESH_TIME * 1000
  ) {
    await db
      .update(sessions)
      .set({
        expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
      })
      .where(eq(sessions?.id, user?.session?.id));

    return user;
  }

  // if session is valid
  return user;
};

export const invalidateSession = async (id: string) => {
  await db.delete(sessions).where(eq(sessions?.id, id));
};
