import { useEffect, useMemo, useReducer, useRef } from "react";
import { Factor } from "@slashid/slashid";
import { Button, Divider } from "@slashid/react-primitives";

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
} from "../../domain/handles";

import * as styles from "./dynamic-flow.css";
import { HandleForm } from "./handle-form";
import { Loader } from "../form/authenticating/icons";
import { useInternalFormContext } from "../form/internal-context";
import { BackButton } from "../form/authenticating/authenticating.components";
import { FailureReason, init, reducer } from "./initial-state";

type Props = {
  flowState: InitialState;
  handleSubmit: (factor: Factor, handle?: Handle) => void;
  getFactors: (handle: Handle) => Promise<Factor[]> | Factor[];
  middleware?: LoginOptions["middleware"];
  attemptSSO?: boolean;
};

export const Initial = ({
  flowState,
  handleSubmit,
  middleware,
  getFactors,
  attemptSSO,
}: Props) => {
  const [state, dispatch] = useReducer(reducer, flowState.resumedHandle, init);
  const previousFlowState = useRef(flowState);

  // a new initial state means the flow moved; the mount run is not a move
  useEffect(() => {
    if (previousFlowState.current === flowState) return;
    previousFlowState.current = flowState;
    dispatch({ type: "reset", resumedHandle: flowState.resumedHandle });
  }, [flowState]);

  useEffect(() => {
    if (state.step !== "attempting_sso") return;
    handleSubmit({ method: "hook" }, state.handle);
  }, [state, handleSubmit]);

  useEffect(() => {
    if (state.step !== "resolving_factors") return;
    const { handle } = state;
    let cancelled = false;

    (async () => {
      try {
        const factors = await getFactors(handle);
        if (cancelled) return;

        if (factors.length === 0) {
          dispatch({ type: "resolve_failed", reason: "no_factors" });
        } else if (factors.length === 1) {
          handleSubmit(factors[0], handle);
        } else {
          dispatch({ type: "factors_resolved", factors });
        }
      } catch {
        if (cancelled) return;
        dispatch({ type: "resolve_failed", reason: "resolve_error" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state, getFactors, handleSubmit]);

  return (
    <div
      data-testid="sid-dynamic-flow--initial-state"
      className="sid-dynamic-flow--initial-state"
    >
      {state.step === "idle" && (
        <Idle
          handleSubmit={(_, handle) => {
            if (!handle) return;
            dispatch({
              type: "submit_handle",
              handle,
              attemptSSO: !!attemptSSO,
            });
          }}
        />
      )}
      {(state.step === "attempting_sso" ||
        state.step === "resolving_factors") && <ResolvingFactors />}
      {state.step === "picking" && (
        <ResolvedFactors
          flowState={flowState}
          handleSubmit={(factor) => {
            handleSubmit(factor, state.handle);
          }}
          factors={state.factors}
          middleware={middleware}
        />
      )}
      {state.step === "failed" && (
        <Failed
          reason={state.reason}
          onRetry={() => dispatch({ type: "retry_resolution" })}
          onBack={() => flowState.cancel()}
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

const FAILURE_TEXT = {
  no_factors: {
    title: "error.title.hookFactorUnresolved",
    subtitle: "error.subtitle.hookFactorUnresolved",
    cta: "error.retry.hookFactorUnresolved",
  },
  resolve_error: {
    title: "error.title",
    subtitle: "error.subtitle",
    cta: "error.retry",
  },
} as const;

function Failed({
  reason,
  onRetry,
  onBack,
}: {
  reason: FailureReason;
  onRetry: () => void;
  onBack: () => void;
}) {
  const { text } = useConfiguration();
  const { title, subtitle, cta } = FAILURE_TEXT[reason];

  return (
    <div data-testid="sid-dynamic-flow--failed" data-reason={reason}>
      <BackButton onCancel={onBack} />
      <div className={styles.header}>
        <Text
          as="h1"
          t={title}
          variant={{ size: "2xl-title", weight: "bold" }}
        />
        <Text
          as="h2"
          t={subtitle}
          variant={{ color: "contrast", weight: "semibold" }}
        />
      </div>
      <Button
        type="button"
        variant="primary"
        testId="sid-dynamic-flow--failed-cta"
        onClick={reason === "no_factors" ? onBack : onRetry}
      >
        {text[cta]}
      </Button>
    </div>
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
