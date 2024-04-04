import { test, expect } from "@playwright/test";
import {
  fetchLatestEmailWithRetry,
  getMessage,
  getTextContent,
  getTheJumpPageURL,
} from "../src/email";

/* const generateRandomNumber = (): number => {
  return Math.floor(Math.random() * 9000) + 1000;
}; */

test.describe("MFA", () => {
  /* let inbox = "e2e";

  test.beforeAll(async () => {
    inbox = `e2e-${generateRandomNumber()}`;
  }); */

  test("Log in with email link", async ({ page, context }) => {
    await page.goto("http://localhost:3000/form");

    await page
      .locator("#sid-input-email_address")
      .fill("e2e@team336427.testinator.com");

    page.getByTestId("sid-form-initial-submit-button").click();

    expect(
      page.locator('[data-testid="sid-form-authenticating-state"]')
    ).toBeVisible();

    const email = await fetchLatestEmailWithRetry();

    expect(email).toBeDefined();

    if (email) {
      const message = await getMessage({ messageId: email.id });

      if (message) {
        const jumpPageURL = getTheJumpPageURL(getTextContent(message));
        console.log("Jump page URL: ", jumpPageURL);

        if (jumpPageURL) {
          const jumpPage = await context.newPage();
          await jumpPage.goto(jumpPageURL);

          await expect(
            jumpPage.locator('[data-testid="sid-form-success-state"]')
          ).toBeVisible();
        }
      }
    }

    await expect(
      page.locator('[data-testid="sid-form-success-state"]')
    ).toBeVisible();
  });
});

/* test("MFA user flow", async ({ page }) => { 

  page.on("console", (msg) => {
    console.log(msg);
  });

  await page.goto("http://localhost:3000/mfa");

  await page.locator("#sid-input-email_address").fill("ivan@slashid.dev");
  await Promise.all([
    page.waitForResponse((response) => response.url().endsWith("/id")),
    page.waitForResponse((response) =>
      response.url().endsWith(`${CHALLENGE_ID}/v2`)
    ),
    page.getByTestId("sid-form-initial-submit-button").click(),
  ]);

  await page.locator("#sid-input-phone_number").fill("7975777666");
  await Promise.all([
    page.waitForResponse((response) => response.url().endsWith("/id")),
    page.waitForResponse((response) =>
      response.url().endsWith(`${SECOND_CHALLENGE_ID}/v2`)
    ),
    page.getByTestId("sid-form-initial-submit-button").click(),
  ]);

  // TODO show user attributes
  await expect(page.getByTestId("sid-user-token")).toContainText(
    USER_TOKEN_TWO_FACTORS
  );
}); */
