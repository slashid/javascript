import { Locator, type Page } from "@playwright/test";

export class JumpPage {
  readonly url: string;
  readonly page: Page;
  readonly successState: Locator;

  constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
    this.successState = this.page.getByTestId("sid-form-success-state");
  }

  async load() {
    await this.page.goto(this.url);
  }

  async enterPassword(password: string) {
    await this.page.locator("#password-input").fill(password);
  }

  async enterPasswordConfirm(password: string) {
    await this.page.locator("#password-input-confirm").fill(password);
  }

  async submitInitialForm() {
    await this.page.getByTestId("sid-form-initial-submit-button").click();
  }
}
