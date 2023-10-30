/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
import { markdown } from "danger";
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const zlib = require("zlib");

const filesToCheck = [
  "packages/react/dist/main.js",
  "packages/react/dist/style.css",
  "packages/react/dist/main.d.ts",
];

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function getGzippedSize(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const gzippedContent = zlib.gzipSync(fileContent);
  return gzippedContent.byteLength;
}

function formatSize(sizeInBytes) {
  return (sizeInBytes / 1024).toFixed(2) + " kB";
}

function formatPercentageChange(oldSize, newSize) {
  if (oldSize === newSize) {
    return "=";
  }
  const change = ((newSize - oldSize) / oldSize) * 100;
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
}

// Get PR bundle file sizes
const prSizes = {};
const prGzipSizes = {};
for (const filePath of filesToCheck) {
  prSizes[filePath] = getFileSize(filePath);
  prGzipSizes[filePath] = getGzippedSize(filePath);
}

// Switch to the main branch and build
execSync("git fetch origin main:main");
execSync("git checkout main");
execSync("pnpm install --frozen-lockfile");
execSync("pnpm build --filter @slashid/react");
const mainSizes = {};
const mainGzipSizes = {};
for (const filePath of filesToCheck) {
  mainSizes[filePath] = getFileSize(filePath);
  mainGzipSizes[filePath] = getGzippedSize(filePath);
}

// Calculate size differences
const sizeDifferences = {};
const gzipSizeDifferences = {};
for (const filePath of filesToCheck) {
  sizeDifferences[filePath] = prSizes[filePath] - mainSizes[filePath];
  gzipSizeDifferences[filePath] =
    prGzipSizes[filePath] - mainGzipSizes[filePath];
}

// Prepare comment
let comment = "## Bundle size comparison\n\n";
comment +=
  "| Name | +/- | Base | Current | +/- gzip | Base gzip | Current gzip |\n";
comment += "| --- | --- | --- | --- | --- | --- | --- |\n";

for (const filePath of filesToCheck) {
  comment += `| ${path.basename(filePath)} `;
  comment += `| ${formatPercentageChange(
    mainSizes[filePath],
    prSizes[filePath]
  )} `;
  comment += `| ${formatSize(mainSizes[filePath])} `;
  comment += `| ${formatSize(prSizes[filePath])} `;
  comment += `| ${formatPercentageChange(
    mainGzipSizes[filePath],
    prGzipSizes[filePath]
  )} `;
  comment += `| ${formatSize(mainGzipSizes[filePath])} `;
  comment += `| ${formatSize(prGzipSizes[filePath])} |\n`;
}

markdown(comment);
