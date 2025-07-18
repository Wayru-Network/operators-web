import FileInput from "@/lib/components/file-input";
import ColorSettings from "@/lib/components/color-settings";
import { Button } from "@heroui/button";
import { PortalConfig } from "./customize-captive-portal";

interface BrandingProps {
  newConfig: PortalConfig;
  selectedHandler: (value: string) => void;
  fileHandler: (file: File, url: string, assetState: "logo" | "banner") => void;
  colorsHandler: (value: {
    background: string;
    button: string;
    text: string;
  }) => void;
}

export default function Branding({
  selectedHandler,
  newConfig,
  fileHandler,
  colorsHandler,
}: BrandingProps) {
  return (
    <div className="flex flex-col justify-start bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8 space-y-4">
      <p className="font-bold text-lg">Step 1: Branding</p>
      <p className="font-semibold">Logo</p>
      <FileInput
        label="logo"
        onSelect={(file, url) => fileHandler(file, url, "logo")}
        existingUrl={newConfig.logo.url || ""}
      />
      <p className="font-semibold">Banner Image</p>
      <FileInput
        label="banner"
        onSelect={(file, url) => fileHandler(file, url, "banner")}
        existingUrl={newConfig.banner.url || ""}
      />

      <p className="font-semibold">Theme settings</p>
      <ColorSettings value={newConfig.colors} onChange={colorsHandler} />
      <div className="flex gap-2 mt-5">
        <Button
          className="w-full text-white dark:text-black rounded-[10px]"
          onPress={() => selectedHandler("step2")}
        >
          Next step
        </Button>
      </div>
    </div>
  );
}
