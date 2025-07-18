import { Button } from "@heroui/button";
import { Wallet } from "lucide-react";
import { getSession } from "@/lib/session/session";

export default async function ConnectWallet() {
  const { wallet } = await getSession();

  return (
    <Button
      variant="bordered"
      className="text-xs rounded-[10px] border-[#c9cecf]"
    >
      <Wallet size={15} />
      {wallet ? wallet : "No wallet found"}
    </Button>
  );
}
