import type { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
  email?: string;
  userId?: string;
  lang?: "es" | "en" | "pt";
  isLoggedIn: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export const defaultSession: SessionPayload = {
  email: "",
  userId: "",
  lang: "en",
  isLoggedIn: false,
  accessToken: "",
  refreshToken: "",
};
