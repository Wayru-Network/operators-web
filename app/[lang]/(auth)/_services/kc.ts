"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  generateCodeVerifier,
  codeChallengeFrom,
  generateState,
} from "@/app/[lang]/(auth)/_services/pkce";
import { env } from "@/lib/infra/env";

const kc = {
  base: env.KEYCLOAK_BASE,
  realm: env.KEYCLOAK_REALM,
  clientId: env.KEYCLOAK_CLIENT_ID,
  redirectUri: env.APP_URL + "/api/auth/callback",
};

const ALLOWED_PROVIDERS = ["facebook", "google", "apple"] as const;
export type Provider = (typeof ALLOWED_PROVIDERS)[number];

export async function socialLogin(provider: Provider) {
  if (!ALLOWED_PROVIDERS.includes(provider)) {
    throw new Error("Invalid provider");
  }

  const verifier = generateCodeVerifier();
  const challenge = codeChallengeFrom(verifier);
  const state = generateState();

  console.log("base", kc.base);
  console.log("realm", kc.realm);
  console.log("clientId", kc.clientId);
  console.log("app URL", env.APP_URL);

  const authUrl = new URL(
    `${kc.base}/realms/${kc.realm}/protocol/openid-connect/auth`,
  );
  authUrl.search = new URLSearchParams({
    client_id: kc.clientId ?? "",
    redirect_uri: kc.redirectUri,
    response_type: "code",
    scope: "openid profile email",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    kc_idp_hint: provider,
    prompt: "login",
  }).toString();

  const cookieStore = await cookies();
  cookieStore.set("pkce_verifier", verifier, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  cookieStore.set("pkce_state", state, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  console.log("Redirecting to Keycloak for social login:", authUrl.toString());

  redirect(authUrl.toString());
}
