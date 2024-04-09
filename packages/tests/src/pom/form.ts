import { Locator, type Page } from "@playwright/test";
import type { FactorMethod } from "@slashid/slashid";

type FactorMethodLabel = "OTP via email" | "Email link";

function getLabelFromFactorMethod(method: FactorMethod): FactorMethodLabel {
  // @ts-expect-error add missing labels when needed
  const methodToLabel: Record<FactorMethod, FactorMethodLabel> = {
    otp_via_email: "OTP via email",
    email_link: "Email link",
  };

  return methodToLabel[method];
}

export class FormPage {
  readonly url: string = "http://localhost:3000/form";
  readonly page: Page;
  readonly successState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successState = this.page.getByTestId("sid-form-success-state");
  }

  async load() {
    await this.page.goto(this.url);
  }

  async selectAuthMethod(method: FactorMethod) {
    // hack alert - make sure the strings are correct
    const label = getLabelFromFactorMethod(method);

    await this.page.locator(".sid-dropdown__trigger").click();
    await this.page.getByText(label).first().click();
  }

  async enterEmail(email: string) {
    await this.page.locator("#sid-input-email_address").fill(email);
  }

  async submitInitialForm() {
    await this.page.getByTestId("sid-form-initial-submit-button").click();
  }

  async submitOTP(otp: string) {
    await this.page.locator(".sid-otp-input").waitFor({ state: "visible" });
    let index = 0;
    for (const otpCodeInput of await this.page
      .locator(".sid-otp-input > input")
      .all()) {
      await otpCodeInput.fill(otp.charAt(index));
      index++;
    }
  }
}
