"use server";
import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "./session-interface";
import { defaultSession } from "./session-interface";

const secretKey = process.env.SESSION_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId,
    expiresAt,
    isLoggedIn: true,
  } as SessionPayload);
  const cookieStore = await cookies();

  cookieStore.set("wayru-operator-session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("wayru-operator-session");
}

export async function getSession(): Promise<SessionPayload> {
  const cookieStore = await cookies();
  const session = cookieStore.get("wayru-operator-session")?.value;
  if (!session) return defaultSession;

  const payload = await decrypt(session);
  if (!payload) return defaultSession;

  return payload as SessionPayload;
}

export async function updateSession(
  updates: Partial<SessionPayload>
): Promise<void> {
  const cookieStore = await cookies();

  const current = await getSession();

  const next: SessionPayload = { ...current, ...updates };

  const expiresAt =
    next.expiresAt instanceof Date
      ? next.expiresAt
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  next.expiresAt = expiresAt;

  const jwt = await encrypt(next);

  cookieStore.set("wayru-operator-session", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}
