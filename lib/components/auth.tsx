"use client";
import Image from "next/image";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { socialLogin } from "@/app/[lang]/(auth)/_services/kc";

interface AuthProps {
  type: "login" | "signup";
  dict: {
    title: string;
    welcome: string;
    facebook: string;
    google: string;
    apple: string;
    already: string;
    alt: string;
  };
}

export default function Auth({ type, dict }: AuthProps) {
  const altHref = type === "login" ? "/signup" : "/login";

  return (
    <Card className="rounded-[20px] shadow-large ring-1 ring-gray-200 dark:ring-0">
      <CardHeader className="pt-14 pb-10 justify-center">
        <Image
          className="dark:invert"
          src="/assets/logo.webp"
          alt="Wayru logo"
          width={131}
          height={42}
          priority
        />
      </CardHeader>
      <CardBody className="px-14 items-center">
        <h1 className="text-[32px] font-bold">{dict.title}</h1>
        <p className="text-[16px]">{dict.welcome}</p>
        <Spacer y={8} />
        <div className="flex flex-col gap-5">
          <Button
            onPress={() => socialLogin("facebook")}
            className="w-[345px] h-[54px] bg-[#1877F2] text-lg dark:text-white rounded-[10px]"
          >
            <Image
              src="/assets/facebook.svg"
              alt="Facebook logo"
              width={24}
              height={24}
            />
            <p>{dict.facebook}</p>
          </Button>
          <Button
            onPress={() => socialLogin("google")}
            className="w-[345px] h-[54px] bg-white dark:bg-black dark:ring-0 ring-1 ring-gray-100 dark:shadow-none shadow-md shadow-gray-300 rounded-[10px]"
          >
            <Image
              src="/assets/google.svg"
              alt="Google logo"
              width={24}
              height={24}
            />
            <p className="text-gray-600 text-lg dark:text-white">
              {dict.google}
            </p>
          </Button>
          <Button
            onPress={() => socialLogin("apple")}
            className="w-[345px] h-[54px] rounded-[10px]"
          >
            <Image
              src="/assets/apple.svg"
              alt="Apple logo"
              width={24}
              height={24}
              className="dark:invert"
            />
            <p className="text-lg">{dict.apple}</p>
          </Button>
        </div>
      </CardBody>
      <CardFooter className="pb-14 text-xs flex flex-row items-center justify-center">
        <p>{dict.already}</p>
        <Spacer x={1} />
        <Link href={altHref} className="text-xs" underline="always">
          {dict.alt}
        </Link>
      </CardFooter>
    </Card>
  );
}
