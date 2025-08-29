import { NewPortalConfig } from "../_components/create-captive-portal";

export function validatePortalConfigInput(
  config: NewPortalConfig
): string | null {
  if (!config.portalName) return "Portal name is required";
  if (config.logo?.file?.name === "undefined" || !config.logo?.file)
    return "No logo set";
  if (config.banner?.file?.name === "undefined" || !config.banner?.file)
    return "No banner set";
  if (config.adAsset?.file?.name === "undefined" || !config.adAsset?.file)
    return "No Ad set";
  if (!config.ad) return "Watch ad access must be selected";
  return null;
}
