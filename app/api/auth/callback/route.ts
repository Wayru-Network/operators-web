import { KeycloakResponse } from "@/lib/interfaces/keycloak-respone";
import { updateSession } from "@/lib/session/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserInfo } from "./_services/token-service";
import { env } from "@/lib/infra/env";
import { logout } from "@/lib/services/logout-service";

interface AddressResponse {
  walletAddress: string;
}

const KC_BASE = env.KEYCLOAK_BASE;
const KC_REALM = env.KEYCLOAK_REALM;
const CLIENT_ID = env.KEYCLOAK_CLIENT_ID;
const REDIRECT = env.APP_URL + "/api/auth/callback";

const TOKEN_ENDPOINT = `${KC_BASE}/realms/${KC_REALM}/protocol/openid-connect/token`;

const valid_emails = [
  "daniel.velasquez@wayru.org",
  "velasmo3@gmail.com",
  "diego@wayru.org",
  "diegoserranor@gmail.com",
  "charvel@wayru.org",
  "wayru.deployer.ecuador@gmail.com",
  "charvel.chedraui@gmail.com",
  "paula@wayru.org",
  "alejandrocamacaro91@gmail.com",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fallbackUrl = new URL("/login", env.APP_URL);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const err = searchParams.get("error");

  console.log("code:", code);
  console.log("state:", state);
  console.log("err:", err);

  if (err) {
    console.log("AUTH FAILURE: Error parameter present:", err);
    return NextResponse.redirect(fallbackUrl);
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("pkce_state")?.value;
  const codeVerifier = cookieStore.get("pkce_verifier")?.value;

  if (!code || !state || state !== savedState || !codeVerifier) {
    console.log("auth failure: PKCE validation failed");
    console.log("- code present:", !!code);
    console.log("- state present:", !!state);
    console.log("- savedState present:", !!savedState);
    console.log("- state matches savedState:", state === savedState);
    console.log("- codeVerifier present:", !!codeVerifier);
    return NextResponse.redirect(fallbackUrl);
  }

  if (!CLIENT_ID) {
    throw new Error("KEYCLOAK_CLIENT_ID is not defined");
  }

  console.log("CLIENT_ID:", CLIENT_ID);
  console.log("REDIRECT:", REDIRECT);

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
    console.log("auth failure: Token exchange failed");
    console.log("- Status:", tokenRes.status);
    console.log("- Status text:", tokenRes.statusText);
    const errorText = await tokenRes.text();
    console.log("- Error response:", errorText);
    return NextResponse.redirect(fallbackUrl);
  }

  const tokens: KeycloakResponse = await tokenRes.json();

  const tokenData = await getUserInfo(tokens.access_token);
  let email = tokenData.email || "";
  const sub = tokenData.sub || "";

  if (!valid_emails.includes(email || "")) {
    console.log("auth failure: Email not in valid list");
    console.log("- Email:", email);
    console.log("- Valid emails:", valid_emails);
    logout(tokens.refresh_token);
    return NextResponse.redirect(fallbackUrl);
  }

  if (email === "velasmo3@gmail.com") email = "danvelc6@gmail.com";
  if (email === "diego@wayru.org") email = "diegoserranor@gmail.com";

  let walletAddress = "";

  try {
    const data = await fetch(
      `${env.BACKEND_URL}/api/wallet/main/by-email/${email}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": env.BACKEND_KEY,
        },
      }
    );

    if (data.ok) {
      const response = (await data.json()) as AddressResponse;
      walletAddress = response.walletAddress || "";
    } else {
      console.log(
        "Warning: Wallet API request failed, proceeding without wallet"
      );
      console.log("- Status:", data.status);
      console.log("- Status text:", data.statusText);
    }
  } catch (error) {
    console.log(
      "Warning: Wallet API request error, proceeding without wallet:",
      error
    );
  }

  await updateSession({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    isLoggedIn: true,
    userId: sub || "",
    email: email || "",
    wallet: walletAddress || "",
  });

  console.log("User logged in:", email, "wallet: ", walletAddress);

  cookieStore.delete("pkce_state");
  cookieStore.delete("pkce_verifier");

  if (!walletAddress) {
    return NextResponse.redirect(new URL("/create-wallet", env.APP_URL));
  }
  return NextResponse.redirect(env.APP_URL + "/dashboard");
}
