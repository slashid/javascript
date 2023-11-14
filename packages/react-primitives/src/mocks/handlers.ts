import { rest } from "msw";
import { createTestUser } from "../components/test-utils";
import { FactorMethod, User } from "@slashid/slashid";
import { HandleType } from "../domain/types";

const BASE_API_URL = "https://api.sandbox.slashid.com";

const route = (path: string) => `${BASE_API_URL}${path}`;

const challenges: Record<string, User> = {};

type PostIdBody = {
  factor: {
    method: FactorMethod;
  };
  handle: {
    type: HandleType;
    value: string;
  };
};

export const handlers = [
  rest.post<PostIdBody>(route("/id"), (req, res, ctx) => {
    if (req.headers.get("Authorization")) {
      // throw error if there is already a token
      throw new Error("override this handler for MFA calls");
    }

    challenges[req.id] = createTestUser({
      oid: req.headers.get("Slashid-Orgid") as string,
      authMethods: [req.body?.factor.method],
      authentications: [
        {
          handle: req.body?.handle,
          factor: req.body?.factor.method,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    return res(
      ctx.status(200),
      ctx.json({
        result: [
          {
            id: req.id,
            options: {
              challenge_id: req.id,
            },
            type: "proxy",
          },
        ],
      })
    );
  }),
  rest.get(route("/challenge/:challenge_id/v2"), (req, res, ctx) => {
    const { challenge_id } = req.params;
    const user = challenges[challenge_id as string];
    delete challenges[challenge_id as string];

    return res(
      ctx.status(200),
      ctx.json({
        result: user,
      })
    );
  }),
  rest.get(route("/token"), (req, res, ctx) => {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const oid = req.headers.get("Slashid-Orgid");

    if (!token || !oid) {
      return res(ctx.status(403));
    }

    return res(
      ctx.status(200),
      ctx.json({
        result: createTestUser({ token, oid }).token,
      })
    );
  }),
];
