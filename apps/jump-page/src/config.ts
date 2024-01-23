// TODO this does not work with .env files
/* export const config = {
  sdkURL:
    import.meta.env.PUBLIC_SID_SDK_URL ||
    "https://cdn.sandbox.slashid.com/sdk.html",
  baseURL:
    import.meta.env.PUBLIC_SID_API_URL || "https://api.sandbox.slashid.com",
}; */

export const config = {
  baseURL: "https://slashid.local",
  sdkURL: "https://jump.slashid.local/sdk.html",
};
