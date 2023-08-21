import { rest } from "msw";
import { createTestUser } from "../components/test-utils";

const BASE_API_URL = "https://api.sandbox.slashid.com";

const route = (path: string) => `${BASE_API_URL}${path}`;

export const handlers = [
  rest.post(route("/id"), (_req, res, ctx) => {
    console.log("/id");
    return res(
      ctx.status(200),
      ctx.json({
        result: [
          {
            id: "test_id",
            options: {
              challenge_id: "test_challenge_id",
            },
            type: "proxy",
          },
        ],
      })
    );
  }),
  rest.get(route("/challenge/:challenge_id/v2"), (_req, res, ctx) => {
    console.log("/v2");

    return res(
      ctx.status(200),
      ctx.json({
        result: createTestUser({ authMethods: ["email_link"] }).token,
      })
    );
  }),
  rest.get(route("/token"), (_req, res, ctx) => {
    console.log("/token");
    return res(
      ctx.status(200),
      ctx.json({
        result: createTestUser({ authMethods: ["email_link"] }).token,
      })
    );
  }),
];
