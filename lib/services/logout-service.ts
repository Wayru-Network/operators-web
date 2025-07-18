"use server";
import { redirect } from "next/navigation";
import { getSession, deleteSession } from "../session/session";

export default async function userLogout() {
  const kc = {
    base: process.env.KEYCLOAK_BASE,
    realm: process.env.KEYCLOAK_REALM,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
  };
  const session = await getSession();
  try {
    fetch(`${kc.base}/realms/${kc.realm}/protocol/openid-connect/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        client_id: kc.clientId || "",
        refresh_token: session.refreshToken || "",
      },
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }
  // Delete the session cookie
  await deleteSession();
  redirect("/login");
}
