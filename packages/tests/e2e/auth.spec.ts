import { test, expect } from "@playwright/test";
import { createTestInbox } from "../src/email";
import { FormPage } from "../src/pom/form";

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

  test("Log in with OTP via email", async ({ page }) => {
    const testInbox = createTestInbox();
    const formPage = new FormPage(page);

    await formPage.load();

    await formPage.selectAuthMethod("otp_via_email");
    await formPage.enterEmail(testInbox.email);
    await formPage.submitInitialForm();

    const email = await testInbox.getLatestEmail();
    expect(email).toBeDefined();
    if (!email) return;

    const otp = await testInbox.getOTP(email);
    expect(otp).toBeDefined();
    if (!otp) return;

    await formPage.submitOTP(otp);

    await expect(formPage.successState).toBeVisible();
  });
});
