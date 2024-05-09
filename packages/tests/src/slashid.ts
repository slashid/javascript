import {
  PersonsService,
  OpenAPI,
  PersonHandleType,
  PersonCredentialsService,
} from "../slashid";
import { hash } from "bcryptjs";

const oid = process.env.SLASHID_ORG_ID!;

OpenAPI.BASE = process.env.SLASHID_API_URL!;
OpenAPI.HEADERS = {
  "SlashID-API-Key": process.env.SLASHID_API_KEY!,
};

export async function createUserWithPassword(email: string, password: string) {
  const { result: user } = await PersonsService.postPersons(oid, {
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
    oid,
    {
      type: "password",
      params: {
        password_hash: passwordHash,
      },
    }
  );
}
