#!/usr/bin/env node

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { program } from "commander";
import { preview } from "astro";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  .option("-a, --api-url <char>", "SlashID API URL", "https://slashid.local")
  .option(
    "-s, --sdk-url <char>",
    "SlashID SDK URL",
    "https://jump.slashid.local"
  )
  .action(async (options) => {
    process.env.PUBLIC_SID_SDK_URL = options.sdkUrl;
    process.env.PUBLIC_SID_API_URL = options.apiUrl;

    console.log("outdir", path.resolve(__dirname, "dist"));

    // TODO this will build with the default values, not the ones passed in
    await preview({
      server: { port: options.port },
      outDir: path.resolve(__dirname, "dist"),
    });
  });

// Parse the command line arguments
program.parse();
