/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
    "@slashid/slashid",
    "@slashid/react",
    "demo-form",
  ],
};
