"use server";
import { cache } from "react";
import { getSession } from "@/lib/session/session";

export const verifySession = cache(async () => {
  const session = await getSession();
  if (session.isLoggedIn) {
    return session;
  } else {
    return null;
  }
});
