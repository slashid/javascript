import { AnonymousUser, User } from "@slashid/slashid";

export const LEGACY_STORAGE_TOKEN_KEY = "@slashid/USER_TOKEN";

export const STORAGE_TOKEN_KEY = (oid: string) =>
  `${LEGACY_STORAGE_TOKEN_KEY}/${oid}`;

export const ORG_SWITCHING_FLAG_KEY = "@slashid/ORG_SWITCHING_FLOW";

export function getStorageKeyForOrgSwitchingUser(user: User | AnonymousUser) {
  if (sessionStorage && sessionStorage.getItem(ORG_SWITCHING_FLAG_KEY)) {
    return STORAGE_TOKEN_KEY(user.oid);
  }
}

/**
 * When using SSO in org switching flows with Home Realm Discovery,
 * redirect UX mode will cause the SDK not to switch to the proper org upon returning to the redirect URL.
 *
 * To fix that, we raise a flag in session storage and ensure the flow is done once we load the page again.
 */
export function raiseOrgSwitchingFlag() {
  if (sessionStorage) {
    sessionStorage.setItem(ORG_SWITCHING_FLAG_KEY, "in_progress");
  }
}

export function clearOrgSwitchingFlag() {
  if (sessionStorage) {
    sessionStorage.removeItem(ORG_SWITCHING_FLAG_KEY);
  }
}

export function shouldResumeOrgSwitchingFlow(
  oid: string,
  user: User | AnonymousUser | undefined | null
) {
  if (
    sessionStorage &&
    sessionStorage.getItem(ORG_SWITCHING_FLAG_KEY) &&
    user &&
    oid !== user.oid
  ) {
    return true;
  }

  clearOrgSwitchingFlag();
  return false;
}
