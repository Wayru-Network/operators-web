import { NewPortalConfig } from "../page";
import FileInput from "./file-input";
import InteractionTime from "./interaction-dropdown";
import AdFormat from "./adformat-dropdown";
import { CustomInput } from "@/lib/components/custom-input";
import { Button } from "@heroui/button";

interface CreateAdProps {
  newConfig: NewPortalConfig;
  adFormatHandler: (value: string) => void;
  fileHandler: (
    file: File,
    url: string,
    assetState: "logo" | "banner" | "ad",
  ) => void;
  interactionTimeHandler: (value: string) => void;
  redirectUrlHandler: (value: string) => void;
  selectedHandler: (value: string) => void;
}

export default function CreateAd({
  newConfig,
  adFormatHandler,
  interactionTimeHandler,
  redirectUrlHandler,
  selectedHandler,
  fileHandler,
}: CreateAdProps) {
  return (
    <div className="h-full flex flex-col justify-start bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8 space-y-4">
      <p className="font-bold text-lg">Step 3: Create an Ad</p>
      <p className="font-semibold text-lg">Ad format</p>
      <AdFormat selected={newConfig.adFormat} setSelected={adFormatHandler} />
      <p className="font-bold text-lg">Upload Media</p>
      <FileInput
        onSelect={(file, url) => fileHandler(file, url, "ad")}
        label="ad"
      />
      <p className="font-semibold text-lg">Minimum interaction time</p>
      <InteractionTime
        selected={newConfig.interactionTime}
        setSelected={interactionTimeHandler}
      />
      <p className="font-semibold text-lg">Portal Text Content</p>
      <CustomInput
        label="Post-Connection Redirect URL"
        placeholder="Enter URL to redirect users after connection"
        helper="Leave empty to skip redirect"
        onChange={(e) => redirectUrlHandler(e.target.value)}
        value={newConfig.redirectUrl || ""}
        type="url"
      />
      <div className="flex gap-2 mt-auto">
        <Button
          className="w-full text-white dark:text-black rounded-[10px]"
          onPress={() => selectedHandler("step2")}
        >
          Previous
        </Button>
        <Button
          className="w-full text-white dark:text-black rounded-[10px]"
          onPress={() => selectedHandler("step4")}
        >
          Next step
        </Button>
      </div>
    </div>
  );
}
