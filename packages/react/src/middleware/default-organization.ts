import { OrganizationDetails, User } from "@slashid/slashid";
import { LoginMiddleware } from "../domain/types";

/**
 * Middleware: post-login switch the users organization context to another suborganization.
 * 
 * This middleware allows for you to login at your root organization but then
 * have the user land in a suborganization e.g. their personal organization,
 * their teams organization, their preferred home, etc.
 * 
 * @param oid the organization id of the users default organization - this can be a string or a function which resolves to a string. When a function is provided it's called with a list of all available organizations for that user, and the user object itself.
 *
 * @example
 * Using a static default organization
 * ```tsx
 * <Form
 *  middleware={[
 *    defaultOrganization("ORG_ID")
 *  ]}
 * />
 * ```
 * 
 * @example
 * Searching for the organization from the users available organizations
 * ```tsx
 * <Form
 *  middleware={[
 *    defaultOrganization(({ organizations }) => 
 *      orgs.find(({ org_name }) => org_name === "home") ?? "FALLBACK_ORG_ID"
 *    )
 *  ]}
 * />
 * ```
 * 
 * @example
 * Getting the default org from a user attribute you've set
 * ```tsx
 * <Form
 *  middleware={[
 *    defaultOrganization(async ({ user }) => {
 *      const bucket = await user.getBucket()
 *      const home = await bucket.get<{ oid }>("preferred_org")
 * 
 *      return home.oid
 *    })
 *  ]}
 * />
 * ```
 */
export const defaultOrganization = (oid: string | ((context: { organizations: OrganizationDetails[], user: User }) => string | Promise<string>)): LoginMiddleware => async ({ user }) => {
  const organizations = await user.getOrganizations()
  const organizationId = typeof oid === "string"
    ? oid
    : await oid({ organizations, user })

  const token = await user.getTokenForOrganization(organizationId)

  return new User(token)
}
