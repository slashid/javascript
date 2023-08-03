import { FormProvider } from "../../context/form-context";
import { Divider } from "../divider";
import { InitialState } from "../form/flow";
import { Logo } from "../form/initial/logo";
import { Oidc } from "../form/initial/oidc";
import { Text } from "../text";
import { useConfiguration } from "../../hooks/use-configuration";
import { ConfiguredHandleForm } from "../form/initial/configured-handle-form";
import { Factor } from "@slashid/slashid";
import { FactorOIDC, Handle } from "../../domain/types";
import { useMemo } from "react";
import { isFactorOidc } from "../../domain/handles";

type Props = {
  flowState: InitialState;
  setHandleAndFactors: (factor: Factor, handle?: Handle) => void;
};

export const Initial = ({ flowState, setHandleAndFactors }: Props) => {
  const { logo, text, factors } = useConfiguration();
  const oidcFactors: FactorOIDC[] = useMemo(
    () => factors.filter(isFactorOidc),
    [factors]
  );
  const shouldRenderDivider = oidcFactors.length > 0;

  return (
    <>
      <Logo logo={logo} />
      <Text
        as="h1"
        variant={{ size: "2xl-title", weight: "bold" }}
        t="initial.title"
      />
      <Text variant={{ color: "tertiary" }} as="h2" t="initial.subtitle" />
      <FormProvider>
        <ConfiguredHandleForm handleSubmit={setHandleAndFactors} />
      </FormProvider>
      {shouldRenderDivider && <Divider>{text["initial.divider"]}</Divider>}
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
  );
};
