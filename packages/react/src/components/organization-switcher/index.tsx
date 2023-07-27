import { ReactNode } from "react";
import { useConfiguration } from "../../hooks/use-configuration";
import { useOrganizations } from "../../hooks/use-organizations"
import { sprinkles } from "../../theme/sprinkles.css";
import { Dropdown } from "../dropdown"

interface Props {
  fallback: ReactNode
}

const className = `sid-organization-switcher ${sprinkles({ marginBottom: "3", marginTop: "5" })}`

const DefaultFallback = () => (
  <Dropdown
    defaultValue={undefined}
    disabled={true}
    className={className}
    items={[]}
    onChange={() => {}}
    label={""}
  />
)

export const OrganizationSwitcher = ({ fallback = <DefaultFallback /> }: Props) => {
  const { text } = useConfiguration();
  const { organizations, currentOrganization, switchOrganization, isLoading } = useOrganizations()

  if (isLoading || !currentOrganization) return fallback

  return (
    <Dropdown
      defaultValue={currentOrganization.id}
      className={className}
      label={text["org.switcher.label"]}
      items={organizations.map((org) => ({
        label: org.org_name,
        value: org.id,
      }))}
      onChange={(oid) =>
        switchOrganization({ oid })
      }
    />
  );
}