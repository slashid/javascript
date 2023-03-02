const organizationId = import.meta.env["VITE_SLASHID_ORGANIZATION_ID"];
if (typeof organizationId != "string" || !organizationId) {
  throw new Error(
    'Invalid configuration, missing "VITE_SLASHID_ORGANIZATION_ID" env'
  );
}

const defaultBaseURL = "http://localhost:8080";
let baseURL = import.meta.env["VITE_BASE_URL"];
if (typeof baseURL != "string" || !baseURL) {
  console.warn(`Missing "VITE_BASE_URL" env, defaulting to ${defaultBaseURL}`);
  baseURL = defaultBaseURL;
}

export const config = {
  baseURL: baseURL,
  organizationId,
};
