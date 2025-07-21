"use client";

import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Snippet } from "@heroui/snippet";
import { Wallet, Copy } from "lucide-react";

interface WalletPopoverProps {
  wallet?: string;
  children?: React.ReactNode;
}

export default function WalletPopover({
  wallet,
  children,
}: WalletPopoverProps) {
  const displayWallet = wallet || "No wallet found";
  const hasWallet = Boolean(wallet);

  const triggerContent = children || (
    <Button
      variant="bordered"
      className="text-xs rounded-[10px] border-[#c9cecf]"
    >
      <Wallet size={15} />
      <p className="max-w-32 overflow-hidden whitespace-nowrap overflow-ellipsis">
        {displayWallet}
      </p>
    </Button>
  );

  return (
    <Popover placement="bottom" showArrow>
      <PopoverTrigger>{triggerContent}</PopoverTrigger>
      <PopoverContent className="p-4 min-w-72">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wallet size={18} />
            <h4 className="font-medium text-sm">Wallet address</h4>
          </div>

          {hasWallet ? (
            <div className="space-y-2">
              <Snippet
                hideSymbol
                size="sm"
                variant="bordered"
                className="w-full"
                codeString={wallet}
                copyIcon={<Copy size={14} />}
              >
                <span className="text-xs font-mono break-all">{wallet}</span>
              </Snippet>
              <p className="text-xs text-gray-500">
                Click the copy button to copy your wallet address
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                No wallet address found in your session
              </p>
              <p className="text-xs text-gray-500">
                Please ensure your wallet is properly connected in the mobile
                app
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
