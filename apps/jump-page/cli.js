#!/usr/bin/env node

import { program } from "commander";
import { createRequire } from "node:module";
import { build, preview } from "astro";

const require = createRequire(import.meta.url);

const packageJson = require("./package.json");

program
  .name("sid-jump-cli")
  .description("/id CLI - Jump page")
  .version(packageJson.version);

program
  .command("serve")
  .description("Start the development server")
  .option(
    "-p, --port <number>",
    "Port to use for the development server",
    (value) => {
      return parseInt(value);
    },
    4321
  )
  .option(
    "-a, --api-url <char>",
    "SlashID API URL",
    "https://api.sandbox.slashid.com"
  )
  .option(
    "-s, --sdk-url <char>",
    "SlashID SDK URL",
    "https://cdn.sandbox.slashid.com/sdk.html"
  )
  .action(async (options) => {
    process.env.PUBLIC_SID_SDK_URL = options.sdkUrl;
    process.env.PUBLIC_SID_API_URL = options.apiUrl;

    await build({});
    await preview({ server: { port: options.port } });
  });

// Parse the command line arguments
program.parse();
