import { checkSession, getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await getSession();
  const sessionCheck = await checkSession(); // Check if session JWT is valid
  if (session.isLoggedIn && sessionCheck) {
    console.log("Session:", session.userId);
    redirect("/dashboard");
  } else {
    redirect("/signup");
  }
}
