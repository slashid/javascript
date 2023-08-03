import { OrganizationDetails, User } from "@slashid/slashid";
import { LoginMiddleware } from "../domain/types";

export const defaultOrganization = (oid: string | ((organizations: OrganizationDetails[]) => string)): LoginMiddleware => async ({ user }) => {
  const orgs = await user.getOrganizations()
  const organizationId = typeof oid === "string"
    ? oid
    : oid(orgs)

  const token = await user.getTokenForOrganization(organizationId)

  return new User(token)
}