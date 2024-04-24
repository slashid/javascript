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

  test("Reset password flow", async ({ page, context }) => {
    const testInbox = createTestInbox();
    const formPage = new FormPage(page);

    await formPage.load();

    await formPage.selectAuthMethod("password");
    await formPage.enterEmail(testInbox.email);
    await formPage.submitInitialForm();

    await expect(formPage.authenticatingState).toBeVisible();

    // verify email on register
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

    // set password
    await formPage.enterPassword("T3stPWD!1");
    await formPage.enterPasswordConfirm("T3stPWD!1");
    await formPage.submitAuthenticatingForm();

    // logged in
    await expect(formPage.successState).toBeVisible();

    // log out

    await formPage.logout();
    await formPage.load();

    // try login with password
    await formPage.selectAuthMethod("password");
    await formPage.enterEmail(testInbox.email);
    await formPage.submitInitialForm();

    // reset password
    await formPage.retry();
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
    await jumpPageReset.submitInitialForm();

    await jumpPageReset.successState.waitFor({
      state: "visible",
      timeout: 8000,
    });

    // log in
    await formPage.enterPassword("T3stPWD!2");
    await formPage.submitAuthenticatingForm();

    // success
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

    const otp = "000000";

    await formPage.submitOTP(otp);

    await expect(formPage.errorMessage).toBeVisible();
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

    await formPage.retry();
    await expect(formPage.emailIcon).toBeVisible();
  });
});
