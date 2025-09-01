import { NewPortalConfig } from "./create-captive-portal";
import { Check } from "lucide-react";

export default function PortalSettings({
  config,
}: {
  config: NewPortalConfig;
}) {
  return (
    <div className="flex flex-col max-w-[50%] bg-[#ffffff] dark:bg-[#191c1d] rounded-[30px] p-8">
      <p className="font-bold text-lg pb-4">Portal Settings</p>
      <div className="h-full min-w-full bg-[#F8FAFA] text-black rounded-[10px] flex flex-col p-7">
        <p className="font-bold">Portal Name</p>
        <p className="pt-1">{config.portalName || "No name set"}</p>
        <p className="font-bold pt-4">Active Flows</p>
        {config.ad && (
          <div className="flex flex-row items-center">
            <Check size={25} />
            <p className="pt-1">Watch ad to connect</p>
          </div>
        )}
        {config.voucher && (
          <div className="flex flex-row items-center">
            <Check size={25} />
            <p className="pt-1">Enter voucher code</p>
          </div>
        )}
        {config.userInfo && (
          <div className="flex flex-row items-center">
            <Check size={25} />
            <p className="pt-1">Submit user info</p>
          </div>
        )}
        <p className="font-bold pt-4">Active Advertisement</p>
        <div className="flex flex-row items-center">
          <Check size={25} />
          <p className="pt-1">
            ad:{" "}
            {!config.ad
              ? "Wayru default"
              : `${
                  config.adFormat.charAt(0).toUpperCase() +
                  config.adFormat.slice(1)
                } ad: "${config.adAsset?.file?.name || "No asset selected"}"`}
          </p>
        </div>
        <p className="font-bold pt-4">Duration</p>
        <div className="flex flex-row items-center">
          <p className="pt-1">{config.interactionTime} (Unskippable)</p>
        </div>
        <p className="font-bold pt-4">Post-Connection Redirect</p>
        <p className="pt-1">{config.redirectUrl || "No redirect URL set"}</p>
      </div>
    </div>
  );
}
