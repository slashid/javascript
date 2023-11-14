import { useState } from "react";
import { Button } from "@slashid/react-primitives";
import { Banner } from "../banner";
import { LivePhotoError } from "../error";
import { FileUpload } from "../file-upload";
import { Stack } from "../stack";
import { Text } from "../text";
import {
  CommonProps,
  documentConstraints,
  blobResize,
  blobToBase64,
} from "../utils";

type Props = CommonProps & {
  enableValidation?: boolean;
};

type State =
  | {
      status: "initial";
    }
  | {
      status: "uploading";
    }
  | {
      status: "failure";
      blob?: Blob;
      reason?: LivePhotoError.Reason;
    }
  | {
      status: "success";
      blob: Blob;
    };

export const MobileLivePhoto = (props: Props) => {
  const { enableValidation = true } = props;
  const [state, setState] = useState<State>({ status: "initial" });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (
      state.status === "initial" &&
      e.target.files &&
      e.target.files[0] !== undefined
    ) {
      setState({
        status: "uploading",
      });

      const blob = e.target.files[0];
      blobResize(blob, documentConstraints)
        .then((resized) => {
          blobToBase64(resized)
            .then((base64) =>
              props.kyc.uploadLivePhoto(props.flowId, base64, enableValidation)
            )
            .then((result) => {
              if (result.status === "error") {
                setState({
                  status: "failure",
                  blob: resized,
                  reason: LivePhotoError.toReason(result.error),
                });
              } else {
                setState({
                  status: "success",
                  blob: resized,
                });
              }
            })
            .catch(() =>
              setState({
                status: "failure",
                blob: resized,
              })
            );
        })
        .catch(() =>
          setState({
            status: "failure",
          })
        );
    }
  };

  const content: JSX.Element = (() => {
    switch (state.status) {
      case "initial":
        return (
          <FileUpload
            status="empty"
            label="kyc.livephoto.mobile.empty"
            cta="kyc.livephoto.mobile.empty.cta"
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
            label="kyc.livephoto.mobile.loading.message"
          />
        );
      case "failure":
        return state.blob ? (
          <FileUpload status="failure" blob={state.blob} />
        ) : (
          <Banner
            variant="failure"
            title="kyc.livephoto.mobile.failure.generic.title"
            description="kyc.livephoto.mobile.failure.generic.description"
          />
        );
    }
  })();

  const feedback: JSX.Element = (() => {
    switch (state.status) {
      case "initial":
      case "uploading":
        return <></>;
      case "success":
        return (
          <Banner
            variant="success"
            title="kyc.livephoto.mobile.success.title"
          />
        );
      case "failure":
        const { title, description } = LivePhotoError.toTextConfigKey(
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
          <Button variant="primary" onClick={props.onContinue}>
            <Text t="kyc.livephoto.mobile.upload.cta.continue" />
          </Button>
        );
      case "failure":
        return (
          <Button
            variant="secondary"
            onClick={() =>
              setState({
                status: "initial",
              })
            }
          >
            <Text t="kyc.livephoto.mobile.upload.cta.again" />
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
            t="kyc.livephoto.mobile.title"
          />
          <Text
            t="kyc.livephoto.mobile.subtitle"
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
};
