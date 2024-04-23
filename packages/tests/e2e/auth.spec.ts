import { test, expect } from "@playwright/test";
import { createTestInbox } from "../src/email";
import { FormPage } from "../src/pom/form";
import { JumpPage } from "../src/pom/jump";

test.describe("Authentication", () => {
  test("Log in with email link", async ({ page, context }) => {
    const testInbox = createTestInbox();
    const formPage = new FormPage(page);

    await formPage.load();

    await formPage.selectAuthMethod("email_link");
    await formPage.enterEmail(testInbox.email);
    await formPage.submitInitialForm();

    await expect(formPage.authenticatingState).toBeVisible();

    const email = await testInbox.getLatestEmail();
    expect(email).toBeDefined();
    if (!email) return;

    const jumpPageURL = await testInbox.getJumpPageURL(email);
    expect(jumpPageURL).toBeDefined();
    if (!jumpPageURL) return;

    const jumpPage = new JumpPage(await context.newPage(), jumpPageURL);
    await jumpPage.load();
    await jumpPage.page.bringToFront();
    await jumpPage.successState.waitFor({
      state: "visible",
      timeout: 4000,
    });

    await expect(jumpPage.successState).toBeVisible();

    await formPage.page.bringToFront();
    await expect(formPage.successState).toBeVisible();
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
