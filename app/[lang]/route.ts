import { getSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await getSession();
  if (session.isLoggedIn) {
    redirect("/dashboard");
  } else {
    redirect("/signup");
  }
}
