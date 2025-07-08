import { Geist, Geist_Mono, Montserrat } from "next/font/google";

export const GeistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const GeistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const MontserratFont = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
