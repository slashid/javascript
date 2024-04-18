const DEFAULT_CONFIG = {
  oid: "b6f94b67-d20f-7fc3-51df-bf6e3b82683e",
  baseApiUrl: "https://api.slashid.com",
  sdkUrl: "https://cdn.slashid.com/sdk.html",
};

export function getConfigFromWindow() {
  return {
    // @ts-expect-error
    oid: window.env.SID_ORG_ID || DEFAULT_CONFIG.oid,
    // @ts-expect-error
    baseApiUrl: window.env.SID_API_URL || DEFAULT_CONFIG.baseApiUrl,
    // @ts-expect-error
    sdkUrl: window.env.SID_SDK_URL || DEFAULT_CONFIG.sdkUrl,
  };
}

export function getConfigFromEnv() {
  return {
    oid: process.env.SID_ORG_ID || DEFAULT_CONFIG.oid,
    baseApiUrl: process.env.SID_API_URL || DEFAULT_CONFIG.baseApiUrl,
    sdkUrl: process.env.SID_SDK_URL || DEFAULT_CONFIG.sdkUrl,
  };
}
