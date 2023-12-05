#!/usr/bin/env node

import { program } from "commander";
import { exec } from "child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const packageJson = require("./package.json");

program
  .name("sid-jump-cli")
  .description("/id CLI - Jump page")
  .version(packageJson.version);

program
  .command("serve")
  .description("Start the development server")
  .option("-p, --port <number>", "Port to use for the development server", 4321)
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
  .action((options) => {
    const command = `PUBLIC_SID_SDK_URL=${options.sdkUrl} PUBLIC_SID_API_URL=${options.apiUrl} npm run dev`;

    // Set the required env variables and execute the "dev" script defined in package.json
    const childProcess = exec(command);

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);

    childProcess.on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });

    childProcess.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  });

// Parse the command line arguments
program.parse();
