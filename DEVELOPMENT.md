# Development

This document describes the development workflow. We are using [Turborepo](https://turbo.build/repo/docs) and [pnpm](https://pnpm.io/motivation).

## Managing dependencies

Check the Turborepo [docs](https://turbo.build/repo/docs/handbook/package-installation#addingremovingupgrading-packages) - make sure you use the `pnpm` code examples.

## Internal packages

`packages/react` is published to NPM but it is also registered as an [internal package](https://turbo.build/repo/docs/handbook/sharing-code/internal-packages). Demo app in `apps/react-vite` depends on this internal package. This means that it will use the build output of `packages/react` instead of the published NPM package. If you want to test the changes you just made in `packages/react`, make sure you run `pnpm build` from the repo root so that `apps/react-vite` will read the new build.

## E2E tests

Our e2e test suite can be run locally (while developing) and in the CI. We recommend installing the Playwright browser binaries directly when working locally and only use Docker in the CI.

These tests only cover the projects in the `apps` folder. Each project is expected to expose a `serve` command that serves the already built app on the predefined e2e tests port - 8084.

### Verifying email

Our authentiction flows require the end user to receive an email and either follow the link from the email or read a special value (OTP code).
In order to test this end to end, we created a [Mailinator](https://www.mailinator.com/v4/private/inboxes.jsp?to=*) account for our team.
Each email is sent to the same domain, but the local part is unique per test run, allowing us to identify email that resulted from a particular test.

### WebAuthn

Not supported yet - we should look into virtual authenticators.

### Running e2e tests locally

Build all the projects and run the `serve` command for the project you want to test before running e2e tests:

```
pnpm build
pnpm serve --filter ${APP_NAME}
pnpm test:e2e
```

Please keep in mind this will fail the first time you run the `test:e2e` command - Playwright will prompt you to install the browser binaries and give you the exact command you need to run.

### Running the tests using Docker

We use the [Docker image with preinstalled browser binaries](https://playwright.dev/docs/docker) - this removes flakiness from the CI as we previously had issues downloading these binaries.

First build the image:

```
docker build . -t e2e-tests
```

Then run it with the specified app name:

```
docker run -i -e APP_NAME=react-nextjs -e MAILINATOR_API_KEY=your-api-key e2e-tests
```

### Updating Playwright

`@playwright/test` in `packages/tests/package.json` and the Playwright image in `Dockerfile` need to use the same version!
