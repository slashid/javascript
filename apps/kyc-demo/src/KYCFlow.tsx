import { DocumentSide, KYC, KYCStatus } from "@slashid/kyc";
import { useMemo, useState } from "react";

import { ConsentAndVerify } from "./steps/ConsentAndVerify";
import { Create } from "./steps/Create";
import { DeleteFlow } from "./DeleteFlow";
import { DeviceSelector } from "./steps/DeviceSelector";
import { DocumentType } from "./steps/DocumentType";
import { LoadingAndResult } from "./steps/LoadingAndResult";
import { MobileQRCode } from "./steps/MobileQRCode";
import { Stack } from "design-system";
import { Upload } from "./steps/Upload";
import { config } from "./config";
import { sid } from "./sid";
import { useSlashID } from "@slashid/react";
import { MobileCompletedFeedback } from "./steps/MobileCompletedFeedback";
import { KYCFlowId } from "@slashid/kyc/dist/client";
import { LivePhotoUpload } from "./steps/LivePhotoUpload";

type State =
  | { status: "initial" }
  | { status: "documentType"; flowId: string }
  | { status: "chooseDevice"; flowId: string; sides: Array<DocumentSide> }
  | { status: "showMobileQRCode"; flowId: string }
  | { status: "upload"; flowId: string; sides: Array<DocumentSide> }
  | { status: "livephoto"; flowId: string }
  | { status: "mobileCompletedFeedback"; flowId: string }
  | { status: "confirm"; flowId: string }
  | { status: "loading"; flowId: string };

const isMobile = window.matchMedia(
  "only screen and (max-width: 480px)"
).matches;

export function KYCFlow() {
  const { user } = useSlashID();
  const kyc = useMemo(
    () =>
      new KYC({
        ...config,
        slashId: sid,
        accessToken: user!.token,
      }),
    []
  );
  const [state, setState] = useState<State>({ status: "initial" });

  const onResumeFlow = (
    flowId: KYCFlowId,
    status: KYCStatus,
    sides?: Array<DocumentSide>,
    remainingDocumentSides?: Array<DocumentSide>
  ) => {
    switch (status) {
      case KYCStatus.COUNTRYSELECTED:
        return setState({ status: "documentType", flowId });
      case KYCStatus.DOCUMENTSELECTED:
        if (!isMobile) {
          if (sides) {
            return setState({ status: "chooseDevice", flowId, sides });
          } else {
            throw new Error(`Invalid state: flow ${flowId} status ${status}`);
          }
        }
      case KYCStatus.DOCUMENTUPLOADED:
        if (sides && remainingDocumentSides) {
          if (remainingDocumentSides.length > 0) {
            return setState({ status: "upload", flowId, sides });
          } else {
            return setState({ status: "livephoto", flowId });
          }
        }

        throw new Error(`Invalid state: flow ${flowId} status ${status}`);
      case KYCStatus.LIVEPHOTOUPLOADED:
        return setState({ status: "confirm", flowId });
      case KYCStatus.FINALIZED:
      case KYCStatus.VERIFIED:
        return setState({ status: "loading", flowId });
    }
  };

  const currentStep = (() => {
    switch (state.status) {
      case "initial":
        return (
          <Create
            kyc={kyc}
            onCreated={(flowId) => setState({ status: "documentType", flowId })}
            onResumed={onResumeFlow}
          />
        );

      case "documentType":
        return (
          <DocumentType
            kyc={kyc}
            flowId={state.flowId}
            onDocumentTypeSelected={(sides) =>
              setState({ status: "chooseDevice", flowId: state.flowId, sides })
            }
          />
        );

      case "chooseDevice":
        if (isMobile) {
          return (
            <DocumentType
              kyc={kyc}
              flowId={state.flowId}
              onDocumentTypeSelected={(sides) =>
                setState({ status: "upload", flowId: state.flowId, sides })
              }
            />
          );
        } else {
          return (
            <DeviceSelector
              flowId={state.flowId}
              onMobile={() =>
                setState({ status: "showMobileQRCode", flowId: state.flowId })
              }
              onDesktop={() =>
                setState({
                  status: "upload",
                  flowId: state.flowId,
                  sides: state.sides,
                })
              }
            />
          );
        }

      case "showMobileQRCode":
        return (
          <MobileQRCode
            kyc={kyc}
            flowId={state.flowId}
            onComplete={() =>
              setState({
                status: "mobileCompletedFeedback",
                flowId: state.flowId,
              })
            }
          />
        );

      case "upload":
        return (
          <Upload
            kyc={kyc}
            flowId={state.flowId}
            sides={state.sides}
            onUploadComplete={() =>
              setState({ status: "livephoto", flowId: state.flowId })
            }
          />
        );

      case "mobileCompletedFeedback":
        return (
          <MobileCompletedFeedback
            onContinue={() =>
              setState({ status: "confirm", flowId: state.flowId })
            }
          />
        );

      case "livephoto":
        return (
          <LivePhotoUpload
            kyc={kyc}
            flowId={state.flowId}
            onUploadComplete={() =>
              setState({ status: "confirm", flowId: state.flowId })
            }
          />
        );

      case "confirm":
        return (
          <ConsentAndVerify
            kyc={kyc}
            flowId={state.flowId}
            onConsentGranted={() =>
              setState({ status: "loading", flowId: state.flowId })
            }
          />
        );

      case "loading":
        return (
          <LoadingAndResult
            kyc={kyc}
            flowId={state.flowId}
            onStartNewFlow={() => setState({ status: "initial" })}
          />
        );
    }
  })();
  const deleteFlow = (() => {
    switch (state.status) {
      case "initial":
      case "loading":
        return null;
      default:
        return (
          <DeleteFlow
            flowId={state.flowId}
            kyc={kyc}
            onFlowDeleted={() => setState({ status: "initial" })}
          />
        );
    }
  })();

  return (
    <Stack space={24}>
      {deleteFlow}
      {currentStep}
    </Stack>
  );
}
