import Image from "next/image";
import { getDictionary } from "@/lib/language/dictionaries";
import { PageProps } from "@/lib/interfaces/page";

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.webp"
          alt="Wayru logo"
          width={180}
          height={38}
          priority
        />
        <p className="self-center">{dict.login.title}</p>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>{dict.login.footer}</p>
      </footer>
    </div>
  );
}
