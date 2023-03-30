import { test, expect } from "@playwright/test";

test("load <MultiFactorAuth> demo page", async ({ page }) => {
  await page.goto("http://localhost:3000/mfa");

  await expect(page.locator("h1").first()).toHaveText("<MultiFactorAuth>");
});
