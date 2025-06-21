import { getDictionary } from "@/lib/language/dictionaries";
import { PageProps } from "@/lib/interfaces/page";
import Auth from "@/lib/components/auth";

// Login and Signup are almost identical. They are redundant.
// However, we have both so that users don't trip.
// Each of them is on a separate page so that Next.js statically generates them.
export default async function Signup({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <Auth type="signup" dict={dict.signup} />;
}
