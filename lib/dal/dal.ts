"use server";
import { cache } from "react";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

//TODO: we can check here the subscription status of stripe and handle permissions
export const verifySession = cache(async () => {
  const session = await getSession();
  if (session.isLoggedIn) {
    return session;
  } else {
    redirect("/login");
  }
});

export const authVerifySession = cache(async () => {
  const session = await getSession();
  if (session.isLoggedIn) {
    redirect("/dashboard");
  }
});
