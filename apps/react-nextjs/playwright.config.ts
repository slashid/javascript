import { PlaywrightTestConfig } from "@playwright/test";
import base from "@slashid/tests/playwright.config";

const config: PlaywrightTestConfig = {
  ...base,
  testDir: "../../packages/tests/e2e",
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
