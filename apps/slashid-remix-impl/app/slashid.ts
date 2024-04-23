import { createSlashIDApp } from "@slashid/remix";

export const { SlashIDApp, slashIDRootLoader, slashIDLoader } =
  createSlashIDApp({
    // configured for the testing environment as e2e tests depend on this
    oid: "00000000-0000-0000-0200-000000000000",
    baseApiUrl: "https://api.valhalla.slashid.dev",
    sdkUrl: "https://cdn.valhalla.slashid.dev/sdk.html",
  });
