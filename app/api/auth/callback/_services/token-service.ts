import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";

const KC_BASE = process.env.KEYCLOAK_BASE;
const KC_REALM = process.env.KEYCLOAK_REALM;

const jwks = createRemoteJWKSet(
  new URL(`${KC_BASE}/realms/${KC_REALM}/protocol/openid-connect/certs`)
);

const clientId = process.env.KEYCLOAK_CLIENT_ID;

export interface TokenClaims extends JWTPayload {
  email?: string;
  preferred_username?: string;
}

export async function verifyToken(token: string): Promise<TokenClaims> {
  const { payload } = await jwtVerify<TokenClaims>(token, jwks, {
    issuer: `${KC_BASE}/realms/${KC_REALM}`,
  });
  return payload;
}

export async function getEmail(token: string): Promise<string | undefined> {
  const { email } = await verifyToken(token);
  return email;
}
