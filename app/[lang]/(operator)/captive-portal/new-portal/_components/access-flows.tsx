import { NewPortalConfig } from "./create-captive-portal";
import { Switch } from "@heroui/switch";
import { Star } from "lucide-react";
import { CustomInput } from "@/lib/components/custom-input";
import { Button } from "@heroui/button";

interface AccessFlowsProps {
  newConfig: NewPortalConfig;
  adHandler: (value: boolean) => void;
  voucherHandler: (value: boolean) => void;
  userInfoHandler: (value: boolean) => void;
  selectedHandler: (value: string) => void;
  welcomeMessageHandler: (value: string) => void;
}

export default function AccessFlows({
  newConfig,
  adHandler,
  voucherHandler,
  userInfoHandler,
  selectedHandler,
  welcomeMessageHandler,
}: AccessFlowsProps) {
  return (
    <div className="h-full flex flex-col justify-start bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8 space-y-4">
      <p className="font-bold text-lg">Step 2: Access Flows</p>
      <p className="font-semibold text-lg">Access mechanisms</p>
      <div className="flex flex-col space-y-4 w-full rounded-[10px] bg-[#F8FAFA] dark:bg-[#858585] p-4">
        <div className="flex flex-row items-center">
          <Star className="mr-2" size={30} />
          <div className="flex flex-col justify-center w-full">
            <p className="font-semibold text-black">Watch ad to connect</p>
            <p className="text-sm text-black">
              Users watch an advertisement to gain access
            </p>
          </div>
          <Switch isSelected={newConfig.ad} onValueChange={adHandler} />
        </div>
        <div className="flex flex-row items-center">
          <Star className="mr-2" size={30} />
          <div className="flex flex-col justify-center w-full">
            <p className="font-semibold text-black">Enter voucher code</p>
            <p className="text-sm text-black">
              Users enter a valid voucher code to connect
            </p>
          </div>
          <Switch
            isSelected={newConfig.voucher}
            onValueChange={voucherHandler}
          />
        </div>
        <div className="flex flex-row items-center">
          <Star className="mr-2" size={30} />
          <div className="flex flex-col justify-center w-full">
            <p className="font-semibold text-black">Submit user info</p>
            <p className="text-sm text-black">
              Collect user information before granting access
            </p>
          </div>
          <Switch
            isSelected={newConfig.userInfo}
            onValueChange={userInfoHandler}
          />
        </div>
      </div>
      <p className="font-semibold text-lg">Portal Text Content</p>
      <div className="flex flex-col space-y-10 pt-4">
        <CustomInput
          label="Welcome Message"
          placeholder="Enter welcome message..."
          helper="Max 50 characters"
          onChange={(e) => welcomeMessageHandler(e.target.value)}
          value={newConfig.welcomeMessage}
        />
      </div>
      <div className="flex gap-2 mt-auto">
        <Button
          className="w-full text-white dark:text-black rounded-[10px]"
          onPress={() => selectedHandler("step1")}
        >
          Previous
        </Button>
        <Button
          className="w-full text-white dark:text-black rounded-[10px]"
          onPress={() => selectedHandler("step3")}
        >
          Next step
        </Button>
      </div>
    </div>
  );
}
