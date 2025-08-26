"use client";
import "@/lib/components/layout/globals.css";
import { Providers } from "@/lib/components/layout/providers";
import { GeistMono, GeistSans } from "@/lib/ui/font";
import LogoutButton from "@/lib/components/logout";

export default function MainWalletNeeded() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center w-full min-h-screen p-8 sm:p-16">
        <h1 className="text-2xl font-normal">Main Wallet Needed</h1>
        <div className="w-full sm:w-auto flex flex-col items-center text-center gap-4 bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-5 sm:p-10">
          <h3>Oops!</h3>
          <p>Seems like we could not find your Main Wallet</p>
          <p>
            Please select the wallet of your miners in the Wayru Wifi App as the{" "}
            <span className="font-bold">Main Wallet</span>
          </p>
          <p>Once you have selected your main wallet please login again</p>
          <LogoutButton />
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased w-full min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};
