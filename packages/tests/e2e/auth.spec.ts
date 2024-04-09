import { test, expect } from "@playwright/test";
import { createTestInbox } from "../src/email";

test.describe("Authentication", () => {
  test("Log in with email link", async ({ page, context }) => {
    const testInbox = createTestInbox();

    await page.goto("http://localhost:3000/form");

    await page.locator("#sid-input-email_address").fill(testInbox.email);

    page.getByTestId("sid-form-initial-submit-button").click();

    await expect(
      page.getByTestId("sid-form-authenticating-state")
    ).toBeVisible();

    const email = await testInbox.getLatestEmail();

    expect(email).toBeDefined();

    if (email) {
      const jumpPageURL = await testInbox.getJumpPageURL(email);

      if (jumpPageURL) {
        const jumpPage = await context.newPage();
        await jumpPage.goto(jumpPageURL);
        await jumpPage.bringToFront();

        const jumpPageSuccessState = page.getByTestId("sid-form-success-state");
        await jumpPageSuccessState.waitFor({
          state: "visible",
          timeout: 4000,
        });

        await expect(jumpPageSuccessState).toBeVisible();
      }
    }

    await page.bringToFront();
    await expect(page.getByTestId("sid-form-success-state")).toBeVisible();
  });
});
