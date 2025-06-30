import { randomBytes, createHash } from "crypto";

export function generateCodeVerifier(): string {
  return randomBytes(64).toString("base64url");
}

export function codeChallengeFrom(verifier: string): string {
  const hash = createHash("sha256").update(verifier).digest();
  return hash.toString("base64url");
}

export function generateState(): string {
  return randomBytes(16).toString("hex");
}
