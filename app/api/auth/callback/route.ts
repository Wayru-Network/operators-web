import { KeycloakResponse } from "@/lib/interfaces/keycloak-respone";
import { updateSession } from "@/lib/session/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getEmail } from "./_services/token-service";

const KC_BASE = process.env.KEYCLOAK_BASE;
const KC_REALM = process.env.KEYCLOAK_REALM;
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const REDIRECT = process.env.APP_URL + "/api/auth/callback";

const TOKEN_ENDPOINT = `${KC_BASE}/realms/${KC_REALM}/protocol/openid-connect/token`;

const valid_emails = [
  "daniel.velasquez@wayru.org",
  "diego@wayru.org",
  "charvel@wayru.org",
  "paula@wayru.org",
  "velasmo3@gmail.com",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fallbackUrl = new URL("/login", req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const err = searchParams.get("error");

  if (err) {
    return NextResponse.redirect(fallbackUrl);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("pkce_state")?.value;
  const codeVerifier = cookieStore.get("pkce_verifier")?.value;

  if (!code || !state || state !== savedState || !codeVerifier) {
    return NextResponse.redirect(fallbackUrl);
  }

  if (!CLIENT_ID) {
    throw new Error("KEYCLOAK_CLIENT_ID is not defined");
  }
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT,
    code,
    code_verifier: codeVerifier,
  });

  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(fallbackUrl);
  }

  const tokens: KeycloakResponse = await tokenRes.json();

  const email = await getEmail(tokens.access_token);

  if (!valid_emails.includes(email || "")) {
    return NextResponse.redirect(fallbackUrl);
  }

  await updateSession({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    isLoggedIn: true,
    userId: tokens.session_state,
    email: email || "",
  });

  cookieStore.delete("pkce_state");
  cookieStore.delete("pkce_verifier");

  return NextResponse.redirect(process.env.APP_URL + "/dashboard");
}
