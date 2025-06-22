import { Button } from "@heroui/button";
import { Plus } from "lucide-react";

export default function ConnectWallet() {
  return (
    <Button
      variant="bordered"
      className="text-xs rounded-[10px] border-[#c9cecf]"
    >
      <Plus size={15} />
      Connect wallet
    </Button>
  );
}
