import {
  PersonsService,
  OpenAPI,
  PersonHandleType,
  PersonCredentialsService,
} from "../slashid";
import { config } from "../config";
import { hash } from "bcryptjs";

OpenAPI.BASE = config.sidApiUrl;
OpenAPI.HEADERS = {
  "SlashID-API-Key": config.sidApiKey,
};

export async function createUserWithPassword(email: string, password: string) {
  const { result: user } = await PersonsService.postPersons(config.sidOid, {
    handles: [
      {
        type: PersonHandleType.EMAIL_ADDRESS,
        value: email,
      },
    ],
  });

  const passwordHash = await hash(password, 10);

  await PersonCredentialsService.postPersonsPersonIdCredentials(
    user.person_id,
    config.sidOid,
    {
      type: "password",
      params: {
        password_hash: passwordHash,
      },
    }
  );
}
