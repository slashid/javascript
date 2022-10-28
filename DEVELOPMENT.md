# Development

This document describes the development workflow. We are using [Turborepo](https://turbo.build/repo/docs) and [pnpm](https://pnpm.io/motivation).

## Managing dependencies

Check the Turborepo [docs](https://turbo.build/repo/docs/handbook/package-installation#addingremovingupgrading-packages) - make sure you use the `pnpm` code examples.

## Internal packages

`packages/react` is published to NPM but it is also registered as an [internal package](https://turbo.build/repo/docs/handbook/sharing-code/internal-packages). Demo app in `apps/react-vite` depends on this internal package. This means that it will use the build output of `packages/react` instead of the published NPM package. If you want to test the changes you just made in `packages/react`, make sure you run `pnpm build` from the repo root so that `apps/react-vite` will read the new build.
