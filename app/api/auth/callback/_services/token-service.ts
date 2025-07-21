import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";
import { env } from "@/lib/infra/env";
import { deleteSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

const KC_BASE = env.KEYCLOAK_BASE;
const KC_REALM = env.KEYCLOAK_REALM;

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!jwks) {
    if (!KC_BASE || !KC_REALM) {
      throw new Error(
        "KEYCLOAK_BASE and KEYCLOAK_REALM environment variables are required"
      );
    }
    jwks = createRemoteJWKSet(
      new URL(`${KC_BASE}/realms/${KC_REALM}/protocol/openid-connect/certs`)
    );
  }
  return jwks;
}

export interface TokenClaims extends JWTPayload {
  email?: string;
  preferred_username?: string;
}

export async function verifyToken(token: string): Promise<TokenClaims> {
  if (!KC_BASE || !KC_REALM) {
    throw new Error(
      "KEYCLOAK_BASE and KEYCLOAK_REALM environment variables are required"
    );
  }

  try {
    const { payload } = await jwtVerify<TokenClaims>(token, getJWKS(), {
      issuer: `${KC_BASE}/realms/${KC_REALM}`,
    });
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    await deleteSession();
    redirect("/login");
  }
}

export async function getUserInfo(
  token: string
): Promise<{ email?: string; sub?: string }> {
  const { email, sub } = await verifyToken(token);
  return { email, sub };
}
