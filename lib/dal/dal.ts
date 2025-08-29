"use server";
import { cache } from "react";
import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

//TODO: we can check here the subscription status of stripe and handle permissions
export const verifySession = cache(async () => {
  const session = await getSession();
  if (session.isLoggedIn && session.wallet !== "") {
    return session;
  } else if (session.isLoggedIn && session.wallet === "") {
    redirect("/main-wallet-not-found");
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

export const verifyLogin = cache(async () => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/login");
  }
});
