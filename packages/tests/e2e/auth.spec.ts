import { test, expect } from "@playwright/test";
import { createTestInbox } from "../src/email";
import { FormPage } from "../src/pom/form";
import { JumpPage } from "../src/pom/jump";
import { createUserWithPassword } from "../src/slashid";

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
      timeout: 8000,
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

  test("Submit incorrect OTP", async ({ page }) => {
    const testInbox = createTestInbox();
    const formPage = new FormPage(page);

    await formPage.load();

    await formPage.selectAuthMethod("otp_via_email");
    await formPage.enterEmail(testInbox.email);
    await formPage.submitInitialForm();

    const email = await testInbox.getLatestEmail();
    expect(email).toBeDefined();
    if (!email) return;

    const incorrectOtp = "000000";

    await formPage.submitOTP(incorrectOtp);

    await expect(formPage.errorMessage).toBeVisible();

    const otp = await testInbox.getOTP(email);
    expect(otp).toBeDefined();
    if (!otp) return;

    await formPage.submitOTP(otp);
    await expect(formPage.errorMessage).not.toBeVisible();

    await expect(formPage.successState).toBeVisible();
  });

  test("Resend OTP code", async ({ page }) => {
    const testInbox = createTestInbox();
    const formPage = new FormPage(page);

    await formPage.load();

    await formPage.selectAuthMethod("otp_via_email");
    await formPage.enterEmail(testInbox.email);
    await formPage.submitInitialForm();

    const email = await testInbox.getLatestEmail();
    expect(email).toBeDefined();
    if (!email) return;

    const initialOtp = await testInbox.getOTP(email);
    expect(initialOtp).toBeDefined();
    if (!initialOtp) return;

    const beforeResend = new Date(Date.now());
    await formPage.resendOTPCode();
    await expect(formPage.emailIcon).toBeVisible();

    const maxRetries = 4;
    let retries = 0;
    let newOtp = "";

    while (retries < maxRetries) {
      await page.waitForTimeout(1000);

      const newEmail = await testInbox.getLatestEmail({
        receivedAfter: beforeResend,
      });
      expect(newEmail).toBeDefined();
      if (!newEmail) continue;

      const initialOtp = await testInbox.getOTP(email);
      expect(initialOtp).toBeDefined();
      if (!initialOtp) continue;

      const otp = await testInbox.getOTP(newEmail);
      expect(otp).toBeDefined();
      if (!otp) continue;

      if (otp !== initialOtp) {
        newOtp = otp;
        break;
      }

      retries++;
    }

    expect(newOtp).toHaveLength(6);

    await formPage.submitOTP(newOtp);
    await expect(formPage.successState).toBeVisible();
  });
});

test.describe("Recovery", () => {
  test("Reset password flow", async ({ page, context }) => {
    const testInbox = createTestInbox();
    const formPage = new FormPage(page);

    await createUserWithPassword(testInbox.email, "T3stPWD!1");
    await formPage.load();

    // try login with password
    await formPage.selectAuthMethod("password");
    await formPage.enterEmail(testInbox.email);
    await formPage.submitInitialForm();

    await formPage.resetPassword();
    // check email

    const resetEmail = await testInbox.getEmailBySubject("Reset your password");
    expect(resetEmail).toBeDefined();
    if (!resetEmail) return;
    const jumpPageResetURL = await testInbox.getJumpPageURL(resetEmail);
    expect(jumpPageResetURL).toBeDefined();
    if (!jumpPageResetURL) return;

    // change password on jump page
    const jumpPageReset = new JumpPage(
      await context.newPage(),
      jumpPageResetURL
    );
    await jumpPageReset.load();
    await jumpPageReset.page.bringToFront();
    await jumpPageReset.enterPassword("T3stPWD!2");
    await jumpPageReset.enterPasswordConfirm("T3stPWD!2");

    await page.waitForTimeout(1000);
    await jumpPageReset.submitInitialForm();

    await jumpPageReset.successState.waitFor({
      state: "visible",
      timeout: 8000,
    });

    // log in
    await formPage.page.bringToFront();
    await formPage.enterPassword("T3stPWD!2");
    await formPage.submitAuthenticatingForm();

    // success
    await expect(formPage.successState).toBeVisible();
  });
});
