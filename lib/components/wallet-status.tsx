import { getSession } from "@/lib/session/session";
import WalletPopover from "./wallet-popover";

export default async function WalletStatus() {
  const { wallet } = await getSession();

  return <WalletPopover wallet={wallet} />;
}
