import { useEffect, useMemo, useRef, useState } from "react";
import { Factor } from "@slashid/slashid";
import { Divider } from "@slashid/react-primitives";

import { FormProvider } from "../../context/form-context";
import { InitialState } from "../form/flow/flow.common";
import { Logo } from "../form/initial/logo";
import { SSOProviders } from "../form/initial/sso";
import { Text } from "../text";
import { useConfiguration } from "../../hooks/use-configuration";
import { FactorSSO, Handle, LoginOptions } from "../../domain/types";
import {
  hasSSOAndNonSSOFactors,
  isFactorSSO,
  resolveLastHandleValue,
  shouldAttemptSSO,
} from "../../domain/handles";

import * as styles from "./dynamic-flow.css";
import { HandleForm } from "./handle-form";
import { Loader } from "../form/authenticating/icons";
import { useInternalFormContext } from "../form/internal-context";
import { BackButton } from "../form/authenticating/authenticating.components";

type Props = {
  flowState: InitialState;
  handleSubmit: (factor: Factor, handle?: Handle) => void;
  getFactors: (handle: Handle) => Promise<Factor[]> | Factor[];
  middleware?: LoginOptions["middleware"];
  attemptSSO?: boolean;
  /** Start at factor resolution for this handle; no SSO attempt is made for it. */
  initialHandle?: Handle;
  onSSOAttempt?: (handle: Handle) => void;
};

type PreAuthState = "idle" | "resolving_factors" | "resolved_factors";

export const Initial = ({
  flowState,
  handleSubmit,
  middleware,
  getFactors,
  attemptSSO,
  initialHandle,
  onSSOAttempt,
}: Props) => {
  const [handle, setHandle] = useState<Handle | undefined>(initialHandle);
  const [preAuthState, setPreAuthState] = useState<PreAuthState>(
    initialHandle ? "resolving_factors" : "idle"
  );
  const [factors, setFactors] = useState<Factor[]>();
  const previousFlowState = useRef(flowState);

  useEffect(() => {
    (async () => {
      if (!handle || preAuthState !== "resolving_factors") return;

      if (shouldAttemptSSO(handle, attemptSSO, initialHandle)) {
        onSSOAttempt?.(handle);
        handleSubmit({ method: "hook" }, handle);
        return;
      }

      const f = await getFactors(handle);
      if (f.length === 1) {
        handleSubmit(f[0], handle);
        return;
      }

      setFactors(f);
      setPreAuthState("resolved_factors");
    })();
  }, [
    attemptSSO,
    getFactors,
    handle,
    handleSubmit,
    initialHandle,
    onSSOAttempt,
    preAuthState,
  ]);

  // reset on back action (flow cancellation); the mount run is skipped so a
  // resumed instance is not bounced back to idle
  useEffect(() => {
    if (previousFlowState.current === flowState) return;
    previousFlowState.current = flowState;
    setPreAuthState("idle");
  }, [flowState]);

  return (
    <div
      data-testid="sid-dynamic-flow--initial-state"
      className="sid-dynamic-flow--initial-state"
    >
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
  const { lastHandle } = useInternalFormContext();
  const { logo } = useConfiguration();

  return (
    <>
      <Logo logo={logo} />
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
          defaultValue={resolveLastHandleValue(lastHandle, "email_address")}
        />
      </FormProvider>
    </>
  );
}

function ResolvingFactors() {
  return (
    <>
      <div
        className={styles.header}
        data-testid="sid-dynamic-flow--resolving-factors"
      >
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
  const nonSSOFactors = useMemo(
    () => factors.filter((f) => !isFactorSSO(f)),
    [factors]
  );
  const ssoFactors: FactorSSO[] = useMemo(
    () => factors.filter(isFactorSSO),
    [factors]
  );
  const shouldRenderDivider = useMemo(
    () => hasSSOAndNonSSOFactors(factors),
    [factors]
  );
  const { text } = useConfiguration();

  return (
    <>
      <BackButton onCancel={() => flowState.cancel()} />
      <div
        className={styles.header}
        data-testid="sid-dynamic-flow--resolved-factors"
      >
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
      {nonSSOFactors.length > 0 && (
        <FormProvider>
          <HandleForm
            handleType="email_address"
            showFactorsOnly
            factors={nonSSOFactors}
            handleSubmit={handleSubmit}
          />
        </FormProvider>
      )}
      {shouldRenderDivider && <Divider>{text["initial.divider"]}</Divider>}
      <SSOProviders
        providers={ssoFactors}
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
