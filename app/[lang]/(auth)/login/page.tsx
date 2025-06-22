import { PageProps } from "@/lib/interfaces/page";
import Auth from "@/lib/components/auth";
import { getDictionary } from "@/lib/language/dictionaries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Wayru",
};

// Login and Signup are almost identical. They are redundant.
// However, we have both so that users don't trip.
// Each of them is on a separate page so that Next.js statically generates them.
export default async function Login({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <Auth type="login" dict={dict.login} />;
}
