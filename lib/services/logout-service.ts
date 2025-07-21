"use server";
import { redirect } from "next/navigation";
import { getSession, deleteSession } from "../session/session";
import { env } from "@/lib/infra/env";

export default async function userLogout() {
  const kc = {
    base: env.KEYCLOAK_BASE,
    realm: env.KEYCLOAK_REALM,
    clientId: env.KEYCLOAK_CLIENT_ID,
  };
  const session = await getSession();
  try {
    await fetch(
      `${kc.base}/realms/${kc.realm}/protocol/openid-connect/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: kc.clientId || "",
          refresh_token: session.refreshToken || "",
        }),
      }
    );
  } catch (error) {
    console.error("Logout failed:", error);
    return;
  }
  // Delete the session cookie
  await deleteSession();
  redirect("/login");
}
