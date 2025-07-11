"use client";
import Image from "next/image";
import { Button } from "@heroui/button";
import { NewPortalConfig } from "../page";
import { Megaphone, SquarePen, Ticket } from "lucide-react";

export default function Preview({ config }: { config: NewPortalConfig }) {
  const colors = config.colors;
  return (
    <div className="flex flex-col min-w-[31rem] max-w-[31rem] min-h-[51rem] max-h-[51rem] bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8">
      <p className="font-bold text-lg pb-4">Preview</p>
      <div
        className="h-full min-w-full bg-[#F8FAFA] dark:bg-gray-600 text-black rounded-[10px] flex flex-col items-center space-y-4 p-8"
        style={{
          backgroundColor: config.colors.background,
        }}
      >
        {config.logoUrl ? (
          <div className="flex flex-col">
            <Image src={config.logoUrl} alt="Logo" width={50} height={50} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-20 bg-[#D9D9D9] rounded-sm sm:w-96">
            Logo
          </div>
        )}

        <div className="flex flex-col flex-1 w-full">
          <p
            className="text-center py-8 max-w-full break-words"
            style={{ color: config.colors.text }}
          >
            {config.welcomeMessage}
          </p>

          <div className="flex flex-col  gap-4 h-full">
            {config.ad && (
              <Button
                className="flex w-full text-white dark:text-black rounded-full transition-none"
                style={{
                  backgroundColor: colors.button,
                  color: colors.text,
                }}
              >
                <Megaphone className="mr-1" />
                Watch an Ad to connect
              </Button>
            )}
            {config.voucher && (
              <Button
                className="w-full text-white dark:text-black rounded-full transition-none"
                style={{
                  backgroundColor: colors.button,
                  color: colors.text,
                }}
              >
                <Ticket className="mr-1" />
                Enter voucher code to connect
              </Button>
            )}
            {config.userInfo && (
              <Button
                className="w-full text-white dark:text-black rounded-full transition-none"
                style={{
                  backgroundColor: colors.button,
                  color: colors.text,
                }}
              >
                <SquarePen className="mr-1" />
                Fill a form to connect
              </Button>
            )}
            {config.bannerUrl ? (
              <div className="flex flex-col w-full mt-auto">
                <Image
                  src={config.bannerUrl}
                  alt="Banner"
                  width={500}
                  height={500}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-72 bg-[#D9D9D9] rounded-sm mt-auto">
                Banner
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
