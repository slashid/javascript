import { Factor } from "@slashid/slashid";
import { clsx } from "clsx";
import { themeClass, darkTheme, autoTheme } from "../../theme/theme.css";
import { useConfiguration } from "../../hooks/use-configuration";
import * as styles from "../form/form.css";
import { HandleForm, Logo } from "../form/initial";
import { Text } from "../text";
import { FormProvider } from "../../context/form-context";

type Props = {
  className?: string;
  getFactors: (email: string) => Factor[];
};

type FormProps = {
  className?: string;
  children: React.ReactNode;
};

const FormWrapper = ({ children, className }: FormProps) => {
  const { theme } = useConfiguration();

  return (
    <div
      className={clsx(
        "sid-theme-root",
        `sid-theme-root__${theme}`,
        themeClass,
        { [darkTheme]: theme === "dark", [autoTheme]: theme === "auto" },
        styles.form,
        className
      )}
    >
      {children}
    </div>
  );
};

export const DynamicFlow = ({ getFactors, className }: Props) => {
  const { logo } = useConfiguration();
  console.log({ getFactors });

  return (
    <div>
      <FormWrapper className={className}>
        <article data-testid="sid-dynamic-flow--initial-state">
          <Logo logo={logo} />
          <Text
            as="h1"
            variant={{ size: "2xl-title", weight: "bold" }}
            t="initial.title"
          />
          <Text variant={{ color: "tertiary" }} as="h2" t="initial.subtitle" />
          <FormProvider>
            <HandleForm
              handleType="email_address"
              factors={[]}
              handleSubmit={(factor, handle) => getFactors(handle.value)}
            />
          </FormProvider>
        </article>
      </FormWrapper>
    </div>
  );
};
