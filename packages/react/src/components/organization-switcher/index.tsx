import { ReactNode, useMemo } from "react";
import { clsx } from "clsx";
import { OrganizationDetails } from "@slashid/slashid";
import { Dropdown, sprinkles } from "@slashid/react-primitives";
import { useConfiguration } from "../../hooks/use-configuration";
import { useOrganizations } from "../../hooks/use-organizations";
import * as styles from "./index.css";

interface Props {
  fallback?: ReactNode;
  filter?: (organization: OrganizationDetails) => boolean;
  renderLabel?: (organization: OrganizationDetails) => ReactNode;
}

const className = sprinkles({ marginBottom: "3", marginTop: "5" });
const noop = () => undefined;

const DefaultFallback = () => {
  const { text } = useConfiguration();

  return (
    <Dropdown
      defaultValue={"-"}
      disabled={true}
      className={className}
      items={[{ label: "-", value: "-" }]}
      onChange={noop}
      label={text["org.switcher.label"]}
    />
  );
};

const Root = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={clsx(styles.organizationSwitcher, "sid-organization-switcher")}
    >
      {children}
    </div>
  );
};

/**
 * First class client-side organization switcher.
 *
 * Renders a list of the users available organizations, upon selection
 * the SDK will switch organizational context to the selected organization
 * and trigger re-render for all code which implements the user object.
 *
 * See also: useOrganizations()
 *
 * @param filter A predicate function to filter the available organizations shown
 * @param fallback The content shown while organizations are being fetched
 * @param renderLabel A render function called for each item in the menu
 */
export const OrganizationSwitcher = ({
  filter,
  fallback = <DefaultFallback />,
  renderLabel,
}: Props) => {
  const { text } = useConfiguration();

  const {
    organizations: allOrganizations,
    currentOrganization,
    switchOrganization,
    isLoading,
  } = useOrganizations();

  const organizations = useMemo(() => {
    if (!filter) return allOrganizations;
    return allOrganizations.filter(filter);
  }, [filter, allOrganizations]);

  if (isLoading || !currentOrganization) {
    return <Root>{fallback}</Root>;
  }

  return (
    <Root>
      <Dropdown
        defaultValue={currentOrganization.id}
        className={className}
        label={text["org.switcher.label"]}
        items={organizations.map((org) => ({
          label: renderLabel ? renderLabel(org) : org.org_name,
          value: org.id,
        }))}
        onChange={(oid) => switchOrganization({ oid })}
      />
    </Root>
  );
};
