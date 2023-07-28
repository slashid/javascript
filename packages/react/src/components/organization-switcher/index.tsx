import { ReactNode, useMemo } from "react";
import { useConfiguration } from "../../hooks/use-configuration";
import { useOrganizations } from "../../hooks/use-organizations"
import { sprinkles } from "../../theme/sprinkles.css";
import { Dropdown } from "../dropdown"
import { clsx } from "clsx";
import { themeClass, darkTheme, autoTheme } from "../../theme/theme.css";
import * as styles from "./index.css";
import { OrganizationDetails } from "@slashid/slashid";
import { useSlashID } from "../../main";

interface Props {
  fallback?: ReactNode
  filter?: (organization: OrganizationDetails) => boolean
}

const className = sprinkles({ marginBottom: "3", marginTop: "5" })

const DefaultFallback = () => {
  const { text } = useConfiguration();

  return (
    <Dropdown
      defaultValue={''}
      disabled={true}
      className={className}
      items={[{ label: '-', value: '' }]}
      onChange={() => {}}
      label={text["org.switcher.label"]}
    />
  )
}

const ThemeRoot = ({ children }: { children: ReactNode }) => {
  const { theme } = useConfiguration();
  return (
    <div
      className={clsx(
        "sid-theme-root",
        `sid-theme-root__${theme}`,
        themeClass,
        { [darkTheme]: theme === "dark", [autoTheme]: theme === "auto" },
        styles.organizationSwitcher,
        "sid-organization-switcher"
      )}
    >
      {children}
    </div>
  )
}

export const OrganizationSwitcher = ({ filter, fallback = <DefaultFallback /> }: Props) => {
  const { text } = useConfiguration();
  const { __defaultOrgCheckComplete } = useSlashID()
  const { organizations: allOrganizations, currentOrganization, switchOrganization, isLoading } = useOrganizations()

  const organizations = useMemo(() => {
    if (!filter) return allOrganizations
    return allOrganizations.filter(filter)
  }, [filter, allOrganizations])

  if (isLoading || !currentOrganization || !__defaultOrgCheckComplete) {
    return (
      <ThemeRoot>
        {fallback}
      </ThemeRoot>  
    )
  }

  return (
    <ThemeRoot>
      <Dropdown
        key={currentOrganization.id}
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
    </ThemeRoot>
  );
}