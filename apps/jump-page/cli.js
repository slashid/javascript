#!/usr/bin/env node

import { exec } from "child_process";

// Execute the "dev" script defined in package.json
const childProcess = exec("npm run dev");

childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);

childProcess.on("error", (error) => {
  console.error(`Error: ${error.message}`);
});

childProcess.on("close", (code) => {
  console.log(`Child process exited with code ${code}`);
});
