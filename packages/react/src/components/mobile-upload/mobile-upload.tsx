import { useState } from "react";
// @ts-expect-error TODO fix enums in KYC SDK
import { DocumentSide, DocumentType } from "@slashid/slashid";
import { Button } from "@slashid/react-primitives";
import {
  blobResize,
  blobToBase64,
  documentConstraints,
  CommonProps,
} from "../utils";
import { FileUpload } from "../file-upload";
import { Banner } from "../banner";
import { darkThemeColors, lightTheme } from "../../theme/theme.css";
import { Text } from "../text";
import { Stack } from "../stack";
import { ImageQualityError } from "../error";

export type Theme = typeof lightTheme;
export type DarkThemeColors = Partial<typeof darkThemeColors>;

type Props = CommonProps & {
  side: DocumentSide;
  documentType: DocumentType;
  remainingSides: Array<DocumentSide>;
};

type State =
  | {
      status: "upload";
      side: DocumentSide;
      documentType: DocumentType;
      remainingSides: Array<DocumentSide>;
    }
  | {
      status: "uploading";
      documentType: DocumentType;
      remainingSides: Array<DocumentSide>;
    }
  | {
      status: "failure";
      side: DocumentSide;
      blob?: Blob;
      documentType: DocumentType;
      remainingSides: Array<DocumentSide>;
      reason?: ImageQualityError.Reason;
    }
  | {
      status: "success";
      side: DocumentSide;
      blob: Blob;
      documentType: DocumentType;
      remainingSides: Array<DocumentSide>;
    };

export function MobileUpload(props: Props) {
  const [state, setState] = useState<State>({
    status: "upload",
    side: props.side,
    documentType: props.documentType,
    remainingSides: props.remainingSides,
  });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (
      state.status === "upload" &&
      e.target.files &&
      e.target.files[0] !== undefined
    ) {
      setState({
        status: "uploading",
        documentType: state.documentType,
        remainingSides: state.remainingSides,
      });

      const blob = e.target.files[0];
      blobResize(blob, documentConstraints)
        .then((resized) => {
          blobToBase64(resized)
            .then((base64) =>
              props.kyc.uploadDocument(props.flowId, state.side, base64)
            )
            .then((result) => {
              if (result.status === "error") {
                setState({
                  status: "failure",
                  side: state.side,
                  blob: resized,
                  documentType: state.documentType,
                  remainingSides: state.remainingSides,
                  reason: ImageQualityError.toReason(result.error),
                });
              } else {
                setState({
                  status: "success",
                  side: state.side,
                  blob: resized,
                  documentType: state.documentType,
                  remainingSides: state.remainingSides.filter(
                    (s) => s != state.side
                  ),
                });
              }
            })
            .catch(() =>
              setState({
                status: "failure",
                side: state.side,
                blob: resized,
                documentType: state.documentType,
                remainingSides: state.remainingSides,
              })
            );
        })
        .catch(() =>
          setState({
            status: "failure",
            side: state.side,
            documentType: state.documentType,
            remainingSides: state.remainingSides,
          })
        );
    }
  };

  function getLabelKey(documentType: DocumentType, documentSide: DocumentSide) {
    switch (documentType) {
      case DocumentType.DRIVERLICENSE:
        return documentSide === DocumentSide.FRONT
          ? "kyc.upload.mobile.empty.driver_license.front"
          : "kyc.upload.mobile.empty.driver_license.back";
      case DocumentType.IDCARD:
        return documentSide === DocumentSide.FRONT
          ? "kyc.upload.mobile.empty.id_card.front"
          : "kyc.upload.mobile.empty.id_card.back";
      case DocumentType.PASSPORT:
        return documentSide === DocumentSide.FRONT
          ? "kyc.upload.mobile.empty.passport.front"
          : "kyc.upload.mobile.empty.passport.back";
      default:
        return "kyc.upload.mobile.empty.passport.front";
    }
  }

  const content: JSX.Element = (() => {
    switch (state.status) {
      case "upload":
        return (
          <FileUpload
            status="empty"
            label={getLabelKey(state.documentType, state.side)}
            cta="kyc.upload.mobile.empty.cta"
            accept={documentConstraints.formats}
            onChange={onChange}
          />
        );
      case "success":
        return <FileUpload status="success" blob={state.blob} />;
      case "uploading":
        return (
          <FileUpload
            status="uploading"
            label="kyc.upload.mobile.loading.message"
          />
        );
      case "failure":
        return state.blob ? (
          <FileUpload status="failure" blob={state.blob} />
        ) : (
          <></>
        );
    }
  })();

  const feedback: JSX.Element = (() => {
    switch (state.status) {
      case "upload":
      case "uploading":
        return <></>;
      case "success":
        return (
          <Banner variant="success" title="kyc.upload.mobile.success.title" />
        );
      case "failure":
        const { title, description } = ImageQualityError.toTextConfigKey(
          state.reason
        );
        return (
          <Banner variant="failure" title={title} description={description} />
        );
    }
  })();

  const action: JSX.Element = (() => {
    switch (state.status) {
      case "success":
        return (
          <Button
            variant="primary"
            onClick={() => {
              state.remainingSides.length !== 0
                ? setState({
                    status: "upload",
                    side: state.remainingSides[0],
                    documentType: state.documentType,
                    remainingSides: state.remainingSides,
                  })
                : props.onContinue();
            }}
          >
            <Text t="kyc.upload.mobile.upload.cta.continue" />
          </Button>
        );
      case "failure":
        return (
          <Button
            variant="secondary"
            onClick={() =>
              setState({
                status: "upload",
                side: state.side,
                documentType: state.documentType,
                remainingSides: state.remainingSides,
              })
            }
          >
            <Text t="kyc.upload.mobile.upload.cta.again" />
          </Button>
        );
      default:
        return <></>;
    }
  })();

  return (
    <Stack variant={{ space: "between" }}>
      <Stack space="5">
        <Stack space="0">
          <Text
            as="h1"
            variant={{ size: "2xl-title", weight: "bold" }}
            t="kyc.upload.mobile.title"
          />
          <Text
            t="kyc.upload.mobile.subtitle"
            variant={{ color: "tertiary" }}
          />
        </Stack>
        {content}
      </Stack>
      <Stack>
        {feedback}
        {action}
      </Stack>
    </Stack>
  );
}
