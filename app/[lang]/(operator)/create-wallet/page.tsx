import { Button } from "@heroui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect or Create Wallet - Wayru",
};

export default function CreateWallet() {
  return (
    <div>
      <h1 className="text-2xl font-normal">Connect or Create Wallet</h1>
      <div className="w-full h-full bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] my-2 p-10">
        <p>Hi! Please connect your wallet or create a new one.</p>
        <Button>Connect Wallet</Button>
      </div>
    </div>
  );
}
