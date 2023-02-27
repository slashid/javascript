import clsx from "clsx";
import { darkTheme, publicVariables, themeClass } from "../../theme/theme.css";
import { DarkThemeColors, MobileUpload, Theme } from "../mobile-upload";
import { Stack } from "../stack";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { mobileFlow } from "./mobile-flow.css";
import { useEffect, useState } from "react";
import { isUploadSupported } from "../utils";
import { DocumentSide, KYC, DocumentType, KYCStatus } from "@slashid/kyc";
import { MobileLivePhoto } from "../mobile-live-photo";
import { Banner } from "../banner";
import { Logo } from "../icon/logo";
import { Header } from "../header";

export class InvalidStateError extends Error {
  constructor(flowId: string, invalidStatus: KYCStatus) {
    super(
      `MobileFlow: Flow ${flowId} is in invalid state ${invalidStatus} to be handled`
    );
  }
}

type CommonProps = {
  /** The authenticated instance of the KYC SDK */
  kyc: KYC;
  /** Enable the live photo step, default `true` */
  includeLivePhoto?: boolean;
  /**
   * Callback invoked when the last step is completed.
   * The last step (document or live photo) depends on the `includeLivePhoto` value.
   */
  onComplete?: () => void;
  /** Object to override the default UI theme. */
  theme?: Theme;
  /** Object to override the default dark theme colors */
  darkThemeColors?: DarkThemeColors;
  /** Callback to render a custom logo. Returns `null` to remove the default logo. */
  logo?: () => JSX.Element | null;
};

type FullModeProps = CommonProps & {
  /**
   * The flow type: `full` (user starts from a mobile device)
   * or `hybrid` (user starts on desktop and delegates the uploading part to a separate mobile device).
   */
  mode: "full";
  /** The flow UUID, required only in `full` mode. */
  flowId: string;
};

type HybridModeProps = CommonProps & {
  /**
   * The flow type: `full` (user starts from a mobile device)
   * or `hybrid` (user starts on desktop and delegates the uploading part to a separate mobile device).
   */
  mode: "hybrid";
};

type Props = FullModeProps | HybridModeProps;

type ErrorReason = "generic" | "invalid_state" | "upload_not_supported";
type State =
  | { status: "loading" }
  | {
      status: "document";
      flowId: string;
      documentType: DocumentType;
      side: DocumentSide;
      remainingSides: DocumentSide[];
    }
  | {
      status: "livephoto";
      flowId: string;
    }
  | { status: "error"; reason: ErrorReason }
  | { status: "completed" };

const rootClass = `sid-theme-root`;

/**
 * The component can be used either in a `full` mobile flow
 * (i.e. one that the user starts from a mobile device) or in a `hybrid` one
 * (i.e. one that starts on desktop and delegates the uploading part to a separate mobile device).
 *
 * The Mobile flow component comes with a built-in UI theme that can be overridden in two ways:
 * using the dedicated React props (`theme` and `darkThemeColors`) or via CSS variables ovverride.
 * 
 * @example Hybrid Flow
 * ```
 * <MobileFlow
 *  mode="hybrid"
 *  kyc={kyc}
 * />;
 * ```
 * 
 * @example Full Flow
 * ```
 * <MobileFlow
 *  mode="full"
 *  flowId={flowId}
 *  kyc={kyc}
 *  onComplete={() => {
      // live photo step is completed, change your application state
 *  }}
 * />;
 * ```
 * 
 */
export const MobileFlow = (props: Props) => {
  const { includeLivePhoto = true } = props;
  const [state, setState] = useState<State>({ status: "loading" });
  const darkThemeColorsOverride = Object.entries(
    props.darkThemeColors || {}
  ).reduce(
    (acc, [k, v]) => ({
      ...acc,
      ...{
        [publicVariables.color[k as keyof typeof publicVariables.color]]: v,
      },
    }),
    {}
  );

  const action = {
    loading: () => setState({ status: "loading" }),
    error: (reason: ErrorReason, msg: string) => {
      console.error(msg);
      setState({ status: "error", reason });
    },
    document: (
      flowId: string,
      documentType: DocumentType,
      side: DocumentSide,
      remainingSides: DocumentSide[]
    ) =>
      setState({
        status: "document",
        documentType,
        side,
        remainingSides,
        flowId,
      }),
    livephoto: (flowId: string) => setState({ status: "livephoto", flowId }),
    completed: () => setState({ status: "completed" }),
  };

  const content: JSX.Element = (() => {
    switch (state.status) {
      case "loading":
        return <></>;
      case "document":
        return (
          <MobileUpload
            flowId={state.flowId}
            kyc={props.kyc}
            documentType={state.documentType}
            side={state.side}
            remainingSides={state.remainingSides}
            onContinue={() =>
              includeLivePhoto
                ? action.livephoto(state.flowId)
                : action.completed()
            }
          />
        );
      case "livephoto":
        return (
          <MobileLivePhoto
            flowId={state.flowId}
            kyc={props.kyc}
            onContinue={action.completed}
          />
        );
      case "error":
        return (
          <Banner
            variant="failure"
            title={`kyc.mobile.failure.${state.reason}.title`}
            description={`kyc.mobile.failure.${state.reason}.description`}
          />
        );
      case "completed":
        return (
          <Banner
            variant="success"
            title={`kyc.mobile.end.title`}
            description={`kyc.mobile.end.description`}
          />
        );
    }
  })();

  // On flow fetched actions are common between mobile flow mode
  const onFlowFetched = (flow: Awaited<ReturnType<typeof props.kyc.flow>>) => {
    switch (flow.status) {
      case KYCStatus.DOCUMENTSELECTED:
      case KYCStatus.DOCUMENTUPLOADED:
        if (!flow.documentType || !flow.remainingDocumentSides) {
          throw new InvalidStateError(flow.flowId, flow.status);
        }

        if (flow.remainingDocumentSides.length > 0) {
          return action.document(
            flow.flowId,
            flow.documentType,
            flow.remainingDocumentSides[0],
            flow.remainingDocumentSides
          );
        }

        return includeLivePhoto
          ? action.livephoto(flow.flowId)
          : action.completed();
      case KYCStatus.LIVEPHOTOUPLOADED:
        return action.completed();
      default:
        throw new InvalidStateError(flow.flowId, flow.status);
    }
  };

  // Resume API varies based on mobile flow mode
  const makeResume = () => {
    switch (props.mode) {
      case "full":
        return props.kyc.flow(props.flowId).then(onFlowFetched);
      case "hybrid":
        return props.kyc.resumeFromMobile().then(onFlowFetched);
    }
  };

  // On mount
  useEffect(() => {
    if (!isUploadSupported()) {
      return action.error(
        "upload_not_supported",
        "MobileFlow: Upload is not supported."
      );
    }

    makeResume().catch((e: Error) =>
      e instanceof InvalidStateError
        ? action.error("invalid_state", e.message)
        : action.error("generic", e.message)
    );
  }, []);

  // On state change
  useEffect(() => {
    state.status === "completed" && props.onComplete && props.onComplete();
  }, [state]);

  const logo = props.logo ? props.logo() : <Logo />;

  return (
    <Stack className={clsx(rootClass, themeClass, darkTheme, clsx(mobileFlow))}>
      {props.theme && (
        <style>
          {`.${rootClass} {${assignInlineVars(publicVariables, props.theme)}}`}
        </style>
      )}
      {props.darkThemeColors && (
        <style>
          {`@media (prefers-color-scheme: dark) {
            .${darkTheme}{${assignInlineVars(darkThemeColorsOverride)}}}`}
        </style>
      )}
      {logo && <Header logo={logo} />}

      {content}
    </Stack>
  );
};
