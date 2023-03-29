import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoggedIn, LoggedOut } from "@slashid/react";
import { UserSSR } from "@slashid/slashid";
import { Profile } from "demo-form";

export async function loader() {
  const user = new UserSSR(
    "eyJhbGciOiJSUzI1NiIsImtpZCI6InBZc05HQSIsInR5cCI6IkNPTlRBSU5FUiJ9.eyJhdWQiOiI4MTdiMWQyOS0zODAwLWJjMGMtMzZlYi04M2FiNjMyZjY2YTUiLCJleHAiOjE2ODAxODM4NjcsImlhdCI6MTY4MDA5NzQ2NywiaXNzIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5zbGFzaGlkLmNvbSIsImp0aSI6IjZiZGQ1OGU1ZDdiZjY0MTk5ZGRkNDExY2E2OWM5OTUzIiwic3ViIjoiMDYzZTRkMjgtZjU4ZC03YmI0LWJjMDgtMDhkODcyZjgwZTg5IiwidXNlcl90b2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW10cFpDSTZJbkJaYzA1SFFTSjkuZXlKaGRXUWlPaUk0TVRkaU1XUXlPUzB6T0RBd0xXSmpNR010TXpabFlpMDRNMkZpTmpNeVpqWTJZVFVpTENKaGRYUm9aVzUwYVdOaGRHVmtYMjFsZEdodlpITWlPbHNpZDJWaVlYVjBhRzRpWFN3aVpYaHdJam94Tmpnd01UZ3pPRFkzTENKbWFYSnpkRjkwYjJ0bGJpSTZabUZzYzJVc0ltZHliM1Z3Y3lJNld5SlVaWE4wTFRFaVhTd2laM0p2ZFhCelgyTnNZV2x0WDI1aGJXVWlPaUpuY205MWNITWlMQ0pwWVhRaU9qRTJPREF3T1RjME5qY3NJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VjMnhoYzJocFpDNWpiMjBpTENKcWRHa2lPaUk1WTJNek5qQTJPR1k0WlRFek9UQTNORFExWmpVNVlqQXpNR1JsTURaaU9DSXNJbTlwWkNJNklqZ3hOMkl4WkRJNUxUTTRNREF0WW1Nd1l5MHpObVZpTFRnellXSTJNekptTmpaaE5TSXNJbkJsY25OdmJsOXBaQ0k2SWpBMk0yVTBaREk0TFdZMU9HUXROMkppTkMxaVl6QTRMVEE0WkRnM01tWTRNR1U0T1NJc0luTjFZaUk2SWpBMk0yVTBaREk0TFdZMU9HUXROMkppTkMxaVl6QTRMVEE0WkRnM01tWTRNR1U0T1NKOS54UEQ3R1Vsci05TmZ0T09rSDJwQ2w4eU8zV201RnRJZnIxZkZGdGdnUnlYTXJKXzlZbFhiRjMyeUR1SVpiNnIxdFowMjYzZG1PMlVfSlNlVmpfSkxsMXBMcmRqdGtocEgtQnlFbG0tcHdEX2FIbWlTUHd6NzlXOHdLcVhsUG8wS1dDSm1xWDVsSm05VEZHclI3cnBGSVA3bm1SMWZuZ3pxMzVsTnR5U0hGRWFQS2IwcEQzUWdVOXB6MVpVM1lFOVNlYzVlbXNieTYzTTlBT3pxeTZkeDM4bXRPS1hpVG1GbU5vbVR4TUQ4aDE2Q29jWGxjMjZTUlc0eTFLZV9Gd3lHUVVpRjNOSmxpa1hpbGVkdHFIWXB5a3V0YjJjeDAwVGNBdkNWeXlCbnBkdWJ6NEFSX0MxdHlJdTlIRE05TEluazZ5WjU1QmpjanBZRkIwQ1hlTFFxLUEifQ.IICZMWjnpGqSF4RsTVqRu6R-5JzgDEaCw-Z9NYqvtC1byWgCtUwl3E4HxzA6KILShq7UazrIFsZJRNb0h1v9bNnHOpnc4H4mQv9sXpTPyRZC7IYWe0kIV7bJpxrlCzAuxVFXueDxUOzGCNSW04jd58V2yl1z96GgRjb71MNWGzQ7JQgYUoIaJf2WM-Wnr6FEbaJQUzNn4UkOjt2qQtfN0mUB7nwyEjfsA8W-lPtu2SxRE2Eyc8dRx0PP5VU4aQkctLc8kNHR8jXqiitFEzKTV2TBHTfwu9NoTxr3_gvRjqEKXVW2AmzG3xHZntBCri6DLIWSSvRE1Qh0VF5JGjRU0w"
  );
  const bucket = await user.getBucket();
  const attributes = await bucket.get();
  return json({ attributes });
}

export default function ProfileRoute() {
  const { attributes } = useLoaderData<typeof loader>();
  return (
    <div className="profile">
      <h1>Attributes under here</h1>
      <pre>{JSON.stringify(attributes, null, 2)}</pre>
      <hr />
      <LoggedOut>No luck here</LoggedOut>
      <LoggedIn>
        <Profile />
      </LoggedIn>
    </div>
  );
}
