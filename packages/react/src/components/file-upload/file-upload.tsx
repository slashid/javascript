import clsx from "clsx";
import { Loading as IconLoading, Stack } from "@slashid/react-primitives";
import { Text } from "../text";
import { TextConfigKey } from "../text/constants";
import * as styles from "./file-upload.css";
import { ReactNode } from "react";

type Props =
  | {
      status: "empty";
      label: TextConfigKey;
      cta: TextConfigKey;
      accept: string;
      onChange: React.ChangeEventHandler<HTMLInputElement>;
    }
  | {
      status: "uploading";
      label: TextConfigKey;
    }
  | {
      status: "success";
      blob: Blob;
    }
  | {
      status: "failure";
      blob: Blob;
    };

export const FileUpload: (props: Props) => JSX.Element = (props) => {
  switch (props.status) {
    case "empty":
      return (
        <InputContainer variant="empty">
          <InputEmpty
            label={props.label}
            cta={props.cta}
            accept={props.accept}
            onChange={props.onChange}
          />
        </InputContainer>
      );
    case "uploading":
      return (
        <InputContainer variant="empty">
          <Loading label={props.label} />
        </InputContainer>
      );
    case "success":
      return (
        <InputContainer variant="success">
          <ImagePreview blob={props.blob} />
        </InputContainer>
      );
    case "failure":
      return (
        <InputContainer variant="failure">
          <ImagePreview blob={props.blob} />
        </InputContainer>
      );
  }
};

const InputContainer = (props: {
  variant: styles.DSUVariants;
  children: ReactNode;
}) => (
  <div className={clsx("sid-dsu-container", styles.dsu[props.variant])}>
    {props.children}
  </div>
);

const InputEmpty = (props: {
  label: TextConfigKey;
  cta: TextConfigKey;
  accept: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => (
  <Stack space="5">
    <Text t={props.label} />
    <input
      id={props.cta}
      className={clsx("sid-dsu-input", styles.inputFile)}
      type="file"
      accept={props.accept}
      onChange={props.onChange}
    />
  </Stack>
);

const Loading = (props: { label: TextConfigKey }) => (
  <Stack className={clsx("sid-dsu-loading", styles.loading)} space="5">
    <Text t={props.label} />
    <IconLoading />
  </Stack>
);

const ImagePreview = (props: { blob: Blob }) => (
  <img
    alt="Document preview"
    src={URL.createObjectURL(props.blob)}
    className={clsx("sid-dsu-image-preview", styles.imagePreview)}
  />
);
