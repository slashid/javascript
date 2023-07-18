import { Factor } from "@slashid/slashid";
import { clsx } from "clsx";
import { themeClass, darkTheme, autoTheme } from "../../theme/theme.css";
import { useConfiguration } from "../../hooks/use-configuration";
import * as styles from "../form/form.css";
import { HandleForm, Logo, Oidc } from "../form/initial";
import { Text } from "../text";
import { FormProvider } from "../../context/form-context";
import { useCallback } from "react";
import { FactorOIDC, Handle } from "../../domain/types";
import { CreateFlowOptions } from "../form/flow";
import { useFlowState } from "../form/useFlowState";
import { Authenticating } from "../form/authenticating";
import { Success } from "../form/success";
import { Error } from "../form/error";
import { Divider } from "../divider";

type Props = {
  className?: string;
  onSuccess?: CreateFlowOptions["onSuccess"];
  getFactor: (email: string) => Factor;
  oidcFactors?: FactorOIDC[];
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

export const DynamicFlow = ({
  getFactor,
  className,
  onSuccess,
  oidcFactors = [],
}: Props) => {
  const { logo, text } = useConfiguration();
  const flowState = useFlowState({ onSuccess });
  const shouldRenderDivider = oidcFactors.length > 0;

  const setHandleAndFactors = useCallback(
    (factor: Factor, handle: Handle) => {
      if (flowState.status === "initial") {
        const factor = getFactor(handle.value);
        flowState.logIn({
          factor,
          handle,
        });
      }
    },
    [getFactor, flowState]
  );

  return (
    <div>
      <FormWrapper className={className}>
        <article data-testid="sid-dynamic-flow--initial-state">
          {flowState.status === "initial" && (
            <>
              <Logo logo={logo} />
              <Text
                as="h1"
                variant={{ size: "2xl-title", weight: "bold" }}
                t="initial.title"
              />
              <Text
                variant={{ color: "tertiary" }}
                as="h2"
                t="initial.subtitle"
              />
              <FormProvider>
                <HandleForm
                  handleType="email_address"
                  factors={[]}
                  handleSubmit={setHandleAndFactors}
                />
              </FormProvider>
              {shouldRenderDivider && (
                <Divider>{text["initial.divider"]}</Divider>
              )}
              <Oidc
                providers={oidcFactors}
                handleClick={(factor) =>
                  flowState.logIn({
                    factor,
                    handle: undefined,
                  })
                }
              />
            </>
          )}
          {flowState.status === "authenticating" && (
            <FormProvider>
              <Authenticating flowState={flowState} />
            </FormProvider>
          )}
          {flowState.status === "error" && <Error flowState={flowState} />}
          {flowState.status === "success" && <Success flowState={flowState} />}
        </article>
      </FormWrapper>
    </div>
  );
};
