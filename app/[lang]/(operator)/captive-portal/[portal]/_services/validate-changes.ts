import { PortalConfig } from "../_components/customize-captive-portal";

export interface validateChangesResult {
  portal_name?: string;
  welcome_message?: string;
  background_color?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  ad_access?: boolean;
  voucher_access?: boolean;
  form_access?: boolean;
  redirect_url?: string;
}

export default function validateChanges(
  newConfig: PortalConfig,
  previousConfig: PortalConfig
): validateChangesResult {
  const updates: validateChangesResult = {};
  if (newConfig.portalName !== previousConfig.portalName) {
    updates.portal_name = newConfig.portalName;
  }
  if (newConfig.welcomeMessage !== previousConfig.welcomeMessage) {
    updates.welcome_message = newConfig.welcomeMessage;
  }
  if (newConfig.colors.background !== previousConfig.colors.background) {
    updates.background_color = newConfig.colors.background;
  }
  if (newConfig.colors.text !== previousConfig.colors.text) {
    updates.text_color = newConfig.colors.text;
  }
  if (newConfig.colors.button !== previousConfig.colors.button) {
    updates.button_color = newConfig.colors.button;
  }
  if (newConfig.colors.buttonText !== previousConfig.colors.buttonText) {
    updates.button_text_color = newConfig.colors.buttonText;
  }

  if (newConfig.ad !== previousConfig.ad) {
    updates.ad_access = newConfig.ad;
  }
  if (newConfig.voucher !== previousConfig.voucher) {
    updates.voucher_access = newConfig.voucher;
  }
  if (newConfig.userInfo !== previousConfig.userInfo) {
    updates.form_access = newConfig.userInfo;
  }
  if (newConfig.redirectUrl !== previousConfig.redirectUrl) {
    updates.redirect_url = newConfig.redirectUrl;
  }

  return updates;
}
