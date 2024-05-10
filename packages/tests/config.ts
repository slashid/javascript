import dotenv from "dotenv";

type Config = {
  oid: string;
  apiKey: string;
  apiURL: string;
  app: string;
  CI: boolean;
};

dotenv.config();

function createE2ETestConfig() {
  const config: Config = {
    oid: process.env.E2E_SID_ORG_ID ?? "",
    apiKey: process.env.E2E_SID_API_KEY ?? "",
    apiURL: process.env.E2E_SID_API_URL ?? "",
    app: process.env.APP_NAME || "",
    CI: process.env.CI === "true",
  };

  if (!config.app) {
    throw new Error("APP_NAME is required in .env file");
  }

  if (!config.oid) {
    throw new Error("E2E_SID_ORG_ID is required in .env file");
  }

  if (!config.apiKey) {
    throw new Error("E2E_SID_API_KEY is required in .env file");
  }

  if (!config.apiURL) {
    throw new Error("E2E_SID_API_URL us required in .env file");
  }

  return config;
}

export const config = createE2ETestConfig();
