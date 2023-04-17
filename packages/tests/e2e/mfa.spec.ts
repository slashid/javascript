import { test, expect } from "@playwright/test";

test("load <MultiFactorAuth> demo page", async ({ page }) => {
  await page.goto("http://localhost:3000/mfa");

  await expect(page.locator("h1").first()).toHaveText("<MultiFactorAuth>");
});

const CHALLENGE_ID = "s8sFY1zTqpOaDHMuofybpA";
const SECOND_CHALLENGE_ID = "second-factor";

test("MFA user flow", async ({ page }) => {
  page.on("request", (request) =>
    console.log(">>", request.method(), request.url())
  );

  page.on("response", async (response) => {
    console.log("<<", response.status(), response.url());
    if (response.url().endsWith("/id")) {
      console.log("<< BODY", await response.json());
    }
  });

  page.on("console", (msg) => {
    console.log(msg);
  });

  await page.route("**/id", (route) => {
    if (route.request().method() === "OPTIONS") {
      route.fulfill({ status: 204 });
    }

    const isFirstFactor = JSON.stringify(
      route.request().postDataJSON()
    ).includes("email_link");

    route.fulfill({
      status: 200,
      body: JSON.stringify({
        result: [
          {
            id: "BVjSjfLe_t95clJPjuVSsg",
            options: {
              challenge_id: isFirstFactor ? CHALLENGE_ID : SECOND_CHALLENGE_ID,
            },
            type: "proxy",
          },
        ],
      }),
    });
  });

  const USER_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjM2NjQwMzAsImp0aSI6ImRjZmMyZmZmYjA0N2I1NTBjYmZmOGQ4MjBjOWVmMWMyIiwiaWF0IjoxNjYzNTc3NjMwLCJpc3MiOiJhcGkuc2FuZGJveC5zbGFzaGlkLmNvbS9hdXRobiIsIm9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMTAwLTAwMDAwMDAwMDAwMCIsInVzZXJfaWQiOiJwaWQ6MDFkNjYxMGFmNDI5OGEwNWJhYWQ1YmMwZDMzMWVjY2NjMmNmYzM4Y2Y4OTcxNjQ4OWFhNzM5YWJjZTIwZjk4ODRmZWJlM2Q2MGE6MiIsImZpcnN0X3Rva2VuIjpmYWxzZSwiYXV0aGVudGljYXRlZF9tZXRob2RzIjpbIm90cF92aWFfc21zIl19.IUD4azKWBBl0rw8GJayOoOZmd_YjZ04LrsAuyvFbv8g";

  const USER_TOKEN_TWO_FACTORS =
    "eyJhbGciOiJSUzI1NiIsICJraWQiOiJ2RXBzRmcifQ.eyJhdXRoZW50aWNhdGVkX21ldGhvZHMiOlsiZW1haWxfbGluayIsIm90cF92aWFfc21zIl0sImV4cCI6MTY2ODc3NTYxNywiZmlyc3RfdG9rZW4iOmZhbHNlLCJncm91cHMiOltdLCJpYXQiOjE2Njg3NjcwMTcsImlzcyI6Imh0dHBzOi8vc2FuZGJveC5zbGFzaGlkLmRldiIsImp0aSI6IjAzOWJiYjI3YzA3YjY5YjIxNzYyZWMwYTFhOWMyZGM1Iiwib2lkIjoiYWQ1Mzk5ZWEtNGU4OC1iMDRhLTE2Y2EtODI5NThjOTU1NzQwIiwidXNlcl9pZCI6InBpZDowMWU0M2YyNDE5ZmU5OTQ4NzlhNjQ1NjRjZDc2YWIzMGE4ZDJlYTk1ZTg5OTg3YzgxODVjZWY1YWI4ZjhhZGY4ZGU2NDNhMjg5YzoyIn0=.tsyUk3guY29r-jb-Xw2htT0egEO3KUErDSlJu9F9Y_QQAf6Te_DmdPgnCKjR7pTGO1uKvYT6JKit7opyntOA4y_wIhymUOkW5mtX-fgyIF0Fkxx1JjGm4BcTE9rI1tH7DWG177yTzwJ2kv5OYvTknpn_QK8s6JzD1N5Yq11_VNf2dRN_NXb-0feqDGhXU7lR-oO7wqFlt37pzENQ7-tG3JDt9uCKqSbrtXqxTHGtg80ZY3FxXYYiHNC3v0nXV5aFRhxGvIIm9LgNkZwXkEtSecIqFHWJn2-ILuOFpvcmtmlZr8AxQyNMAKMt1fARf2LJy45qITI2IyVTndtDekT6HQ";

  await page.route(`**/${CHALLENGE_ID}/v2`, (route) => {
    if (route.request().method() === "OPTIONS") {
      route.fulfill({ status: 204 });
    }

    route.fulfill({
      status: 200,
      body: JSON.stringify({
        result: USER_TOKEN,
      }),
    });
  });

  await page.route(`**/${SECOND_CHALLENGE_ID}/v2`, (route) => {
    if (route.request().method() === "OPTIONS") {
      route.fulfill({ status: 204 });
    }

    route.fulfill({
      status: 200,
      body: JSON.stringify({
        result: USER_TOKEN_TWO_FACTORS,
      }),
    });
  });

  await page.goto("http://localhost:3000/mfa");

  await page.locator("#sid-input-email_address").fill("test@example.com");
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
});
