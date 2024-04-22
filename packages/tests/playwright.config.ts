import { PlaywrightTestConfig, defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

function createPlaywrightConfig(): PlaywrightTestConfig {
  const envConfig = {
    app: process.env.APP_NAME || "",
    CI: process.env.CI === "true",
  };

  if (!envConfig.app) {
    throw new Error("APP_NAME is required in .env file");
  }

  return {
    timeout: 16 * 1000,
    expect: {
      /**
       * Maximum time expect() should wait for the condition to be met.
       * For example in `await expect(locator).toHaveText();`
       */
      timeout: 2 * 1000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: envConfig.CI,
    /* Retry on CI only */
    retries: envConfig.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    // workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [["html", { open: envConfig.CI ? "never" : "on-failure" }]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
      /* Base URL to use in actions like `await page.goto('/')`. */
      // baseURL: 'http://127.0.0.1:3000',

      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: "on-first-retry",
    },

    /* Configure projects for major browsers */
    projects: [
      {
        name: "chromium",
        use: { ...devices["Desktop Chrome"] },
      },

      /* {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
      },
  
      {
        name: "webkit",
        use: { ...devices["Desktop Safari"] },
      }, */

      /* Test against mobile viewports. */
      // {
      //   name: 'Mobile Chrome',
      //   use: { ...devices['Pixel 5'] },
      // },
      // {
      //   name: 'Mobile Safari',
      //   use: { ...devices['iPhone 12'] },
      // },

      /* Test against branded browsers. */
      // {
      //   name: 'Microsoft Edge',
      //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
      // },
      // {
      //   name: 'Google Chrome',
      //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
      // },
    ],
    webServer: {
      command: `pnpm serve --filter ${envConfig.app}`,
      cwd: `${path.resolve(__dirname, "../../")}`,
      url: "http://localhost:3000",
      reuseExistingServer: !envConfig.CI,
      stdout: "pipe",
      stderr: "pipe",
    },
  };
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(createPlaywrightConfig());
