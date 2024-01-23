#!/usr/bin/env node

import { program } from "commander";
import { createRequire } from "node:module";
import { preview } from "astro";

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
    "https://slashid.local"
  )
  .option(
    "-s, --sdk-url <char>",
    "SlashID SDK URL",
    "https://jump.slashid.local"
  )
  .action(async (options) => {
    process.env.PUBLIC_SID_SDK_URL = options.sdkUrl;
    process.env.PUBLIC_SID_API_URL = options.apiUrl;

    // TODO this will build with the default values, not the ones passed in
    await preview({ server: { port: options.port } });
  });

// Parse the command line arguments
program.parse();
