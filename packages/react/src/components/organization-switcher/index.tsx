import { useConfiguration } from "../../hooks/use-configuration";
import { useOrganizations } from "../../hooks/use-organizations"
import { sprinkles } from "../../theme/sprinkles.css";
import { Dropdown } from "../dropdown"
import { Spinner } from "../spinner/spinner";

export function OrganizationSwitcher() {
  const { text } = useConfiguration();
  const { organizations, currentOrganization, switchOrganization, isLoading } = useOrganizations()

  if (isLoading || !currentOrganization) return <Spinner /> // need a better loading state

  return (
    <Dropdown
      defaultValue={currentOrganization.id}
      className={sprinkles({ marginBottom: "3", marginTop: "5" })}
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