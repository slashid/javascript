import { test, expect } from "@playwright/test";
import {
  fetchLatestEmailWithRetry,
  getMessage,
  getTextContent,
  getTheJumpPageURL,
} from "../src/email";

const generateRandomNumber = (): number => {
  return Math.floor(Math.random() * 9000) + 1000;
};

test.describe("Authentication", () => {
  test("Log in with email link", async ({ page, context }) => {
    const inbox = `e2e-${generateRandomNumber()}`;

    await page.goto("http://localhost:3000/form");

    await page
      .locator("#sid-input-email_address")
      .fill(`${inbox}@team336427.testinator.com`);

    page.getByTestId("sid-form-initial-submit-button").click();

    await expect(
      page.getByTestId("sid-form-authenticating-state")
    ).toBeVisible();

    const email = await fetchLatestEmailWithRetry({
      inbox,
    });

    expect(email).toBeDefined();

    if (email) {
      const message = await getMessage({ messageId: email.id });

      if (message) {
        const jumpPageURL = getTheJumpPageURL(getTextContent(message));

        if (jumpPageURL) {
          const jumpPage = await context.newPage();
          await jumpPage.goto(jumpPageURL);
          await jumpPage.bringToFront();

          const jumpPageSuccessState = page.getByTestId(
            "sid-form-success-state"
          );
          await jumpPageSuccessState.waitFor({
            state: "visible",
            timeout: 4000,
          });

          await expect(jumpPageSuccessState).toBeVisible();
        }
      }
    }

    await page.bringToFront();
    await expect(page.getByTestId("sid-form-success-state")).toBeVisible();
  });
});
