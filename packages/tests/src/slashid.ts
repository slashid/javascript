import {
  PersonsService,
  OpenAPI,
  PersonHandleType,
  PersonCredentialsService,
} from "../slashid";
import { config } from "./config";
import { hash } from "bcryptjs";

OpenAPI.BASE = config.apiURL;
OpenAPI.HEADERS = {
  "SlashID-API-Key": config.apiKey,
};

export async function createUserWithPassword(email: string, password: string) {
  const { result: user } = await PersonsService.postPersons(config.oid, {
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
    config.oid,
    {
      type: "password",
      params: {
        password_hash: passwordHash,
      },
    }
  );
}
