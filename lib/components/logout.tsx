import { Button } from "@heroui/button";
import { LogOut } from "lucide-react";
import userLogout from "@/lib/services/logout-service";

export default function LogoutButton() {
  return (
    <Button
      variant="bordered"
      className="text-xs rounded-[10px] border-[#c9cecf]"
      onPress={userLogout}
    >
      <LogOut size={15} />
      Log out
    </Button>
  );
}
