import { Metadata } from "next";
import UnsupportedScreen from "./page";

export const metadata: Metadata = {
  title: "unsupported - Wayru",
  description: "return a screen describing that the device is not supported",
};

export default async function UnsupportedLayout() {
  return (
    <>
      <UnsupportedScreen />
    </>
  );
}
