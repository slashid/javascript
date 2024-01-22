import { SlashID, User } from "@slashid/slashid";
import { LoginMiddleware, LoginMiddlewareContext } from "../domain/types";
import { defaultOrganization } from "./default-organization";

/**
 * Apply middleware to a user. Return an unmodified user object in case of no middleware.
 */
export async function applyMiddleware({
  user,
  sid,
  middleware,
}: {
  user: User;
  sid: SlashID;
  middleware?: LoginMiddleware | LoginMiddleware[];
}): Promise<User> {
  if (middleware === undefined) return user;

  const middlewareAsArray = Array.isArray(middleware)
    ? middleware
    : [middleware];

  return middlewareAsArray.reduce((previous, next) => {
    return previous.then((user) => next({ user, sid }));
  }, Promise.resolve(user));
}

export {
  defaultOrganization,
  type LoginMiddleware,
  type LoginMiddlewareContext,
};
