import { BaseUser, AnonymousUser } from "@slashid/slashid";

export const userIsAnonymous = (user: BaseUser): user is AnonymousUser => {
  return user.anonymous && user instanceof AnonymousUser
};
