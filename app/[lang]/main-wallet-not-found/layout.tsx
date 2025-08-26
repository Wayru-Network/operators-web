import { Metadata } from "next";
import MainWalletNeeded from "./page";
import { verifyLogin } from "@/lib/dal/dal";

export const metadata: Metadata = {
  title: "Main Wallet Not Found - Wayru",
  description: "return a screen describing that the main wallet is not found",
};

export default async function MainWalletNotFoundLayout() {
  await verifyLogin();
  return (
    <>
      <MainWalletNeeded />
    </>
  );
}
