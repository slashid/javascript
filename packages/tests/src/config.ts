type Config = {
  oid: string;
  apiKey: string;
  apiURL: string;
};

function createE2ETestConfig() {
  const config: Config = {
    oid: process.env.E2E_SID_ORG_ID ?? "",
    apiKey: process.env.E2E_SID_API_KEY ?? "",
    apiURL: process.env.E2E_SID_API_URL ?? "",
  };

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
