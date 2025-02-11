import { useEffect, useMemo, useState } from "react";
import { Factor } from "@slashid/slashid";
import { Divider } from "@slashid/react-primitives";

import { FormProvider } from "../../context/form-context";
import { InitialState } from "../form/flow/flow.common";
import { Logo } from "../form/initial/logo";
import { Oidc } from "./oidc";
import { Text } from "../text";
import { useConfiguration } from "../../hooks/use-configuration";
import { FactorLabeledOIDC, Handle, LoginOptions } from "../../domain/types";
import { isFactorNonOidc, isFactorOidc } from "../../domain/handles";

import * as styles from "./dynamic-flow.css";
import { HandleForm } from "./handle-form";
import { Loader } from "../form/authenticating/icons";

type Props = {
  flowState: InitialState;
  handleSubmit: (factor: Factor, handle?: Handle) => void;
  getFactors: (handle: Handle) => Promise<Factor[]> | Factor[];
  middleware?: LoginOptions["middleware"];
};

type PreAuthState = "idle" | "resolving_factors" | "resolved_factors";

export const Initial = ({
  flowState,
  handleSubmit,
  middleware,
  getFactors,
}: Props) => {
  const { logo } = useConfiguration();
  const [handle, setHandle] = useState<Handle>();
  const [preAuthState, setPreAuthState] = useState<PreAuthState>("idle");
  const [factors, setFactors] = useState<Factor[]>();

  useEffect(() => {
    (async () => {
      if (handle && preAuthState === "resolving_factors") {
        const f = await getFactors(handle);
        if (f.length === 1) {
          handleSubmit(f[0], handle);
          return;
        }

        setFactors(f);
        setPreAuthState("resolved_factors");
      }
    })();
  }, [getFactors, handle, handleSubmit, preAuthState]);

  return (
    <div
      data-testid="sid-dynamic-flow--initial-state"
      className="sid-dynamic-flow--initial-state"
    >
      <Logo logo={logo} />
      {preAuthState === "idle" && (
        <Idle
          handleSubmit={(_, handle) => {
            setHandle(handle);
            setPreAuthState("resolving_factors");
          }}
        />
      )}
      {preAuthState === "resolving_factors" && <ResolvingFactors />}
      {factors && preAuthState === "resolved_factors" && (
        <ResolvedFactors
          flowState={flowState}
          handleSubmit={(factor) => {
            handleSubmit(factor, handle);
          }}
          factors={factors}
          middleware={middleware}
        />
      )}
    </div>
  );
};

function Idle({ handleSubmit }: { handleSubmit: Props["handleSubmit"] }) {
  return (
    <>
      <div className={styles.header}>
        <Text
          as="h1"
          t="initial.title"
          variant={{ size: "2xl-title", weight: "bold" }}
        />
        <Text
          as="h2"
          t="initial.subtitle"
          variant={{ color: "contrast", weight: "semibold" }}
        />
      </div>
      <FormProvider>
        <HandleForm
          handleType="email_address"
          factors={[]}
          handleSubmit={handleSubmit}
        />
      </FormProvider>
    </>
  );
}

function ResolvingFactors() {
  return (
    <>
      <div className={styles.header}>
        <Text
          as="h1"
          t="resolving_factors.title"
          variant={{ size: "2xl-title", weight: "bold" }}
        />
        <Text
          as="h2"
          t="resolving_factors.subtitle"
          variant={{ color: "contrast", weight: "semibold" }}
        />
      </div>
      <Loader />
    </>
  );
}

function ResolvedFactors({
  flowState,
  handleSubmit,
  factors,
  middleware,
}: {
  flowState: Props["flowState"];
  handleSubmit: Props["handleSubmit"];
  factors: Factor[];
  middleware: Props["middleware"];
}) {
  const nonOidcFactors = useMemo(
    () => factors.filter(isFactorNonOidc),
    [factors]
  );
  const oidcFactors: FactorLabeledOIDC[] = useMemo(
    () => factors.filter(isFactorOidc),
    [factors]
  );
  const shouldRenderDivider =
    oidcFactors.length > 0 && nonOidcFactors.length > 0;
  const { text } = useConfiguration();

  return (
    <>
      <div className={styles.header}>
        <Text
          as="h1"
          t="resolved_factors.title"
          variant={{ size: "2xl-title", weight: "bold" }}
        />
        <Text
          as="h2"
          t="resolved_factors.subtitle"
          variant={{ color: "contrast", weight: "semibold" }}
        />
      </div>
      {nonOidcFactors.length > 0 && (
        <FormProvider>
          <HandleForm
            handleType="email_address"
            showFactorsOnly
            factors={nonOidcFactors}
            handleSubmit={handleSubmit}
          />
        </FormProvider>
      )}
      {shouldRenderDivider && <Divider>{text["initial.divider"]}</Divider>}
      <Oidc
        providers={oidcFactors}
        handleClick={(factor) =>
          flowState.logIn(
            {
              factor,
              handle: undefined,
            },
            { middleware }
          )
        }
      />
    </>
  );
}
