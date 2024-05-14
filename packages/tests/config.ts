import dotenv from "dotenv";

type Config = {
  app: string;
  CI: boolean;
  sidOid: string;
  sidApiKey: string;
  sidApiUrl: string;
  mailApiKey: string;
  mailServerId: string;
};

dotenv.config();

function createE2ETestConfig() {
  const config: Config = {
    app: process.env.APP_NAME || "",
    CI: process.env.CI === "true",
    sidOid: process.env.E2E_SID_ORG_ID ?? "",
    sidApiKey: process.env.E2E_SID_API_KEY ?? "",
    sidApiUrl: process.env.E2E_SID_API_URL ?? "",
    mailApiKey: process.env.MAILOSAUR_API_KEY ?? "",
    mailServerId: process.env.MAILOSAUR_SERVER_ID ?? "",
  };

  if (!config.app) {
    throw new Error("APP_NAME is required in .env file");
  }

  if (!config.sidOid) {
    throw new Error("E2E_SID_ORG_ID is required in .env file");
  }

  if (!config.sidApiKey) {
    throw new Error("E2E_SID_API_KEY is required in .env file");
  }

  if (!config.sidApiUrl) {
    throw new Error("E2E_SID_API_URL us required in .env file");
  }

  if (!config.mailServerId || !config.mailApiKey) {
    throw new Error("Mailosaur configuration is missing");
  }

  return config;
}

export const config = createE2ETestConfig();
