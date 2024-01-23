export const config = {
  sdkURL:
    import.meta.env.PUBLIC_SID_SDK_URL ||
    "https://cdn.sandbox.slashid.com/sdk.html",
  baseURL:
    import.meta.env.PUBLIC_SID_API_URL || "https://api.sandbox.slashid.com",
};
