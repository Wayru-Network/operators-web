import { getDictionary } from "@/lib/language/dictionaries";
import { PageProps } from "@/lib/interfaces/page";
import Auth from "@/lib/components/auth";
import LangSwitch from "@/lib/components/lang-switch";

// Login and Signup are almost identical. They are redundant.
// However, we have both so that users don't trip.
// Each of them is on a separate page so that Next.js statically generates them.
export default async function Login({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-0 right-0 p-11">
        <LangSwitch />
      </div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Auth type="login" dict={dict.login} />
      </main>
    </div>
  );
}
