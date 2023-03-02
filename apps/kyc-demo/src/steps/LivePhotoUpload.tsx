import { KYC } from "@slashid/slashid";
import {
  Box,
  FileUploaderField,
  Form,
  FormRow,
  FormSection,
  Inline,
} from "design-system";
import { FileResult } from "@buildo/bento-design-system";
import { failure, success } from "@buildo/formo/lib/Result";
import { useFormo, validators } from "@buildo/formo";
import { useState } from "react";

type Props = {
  kyc: KYC;
  flowId: string;
  onUploadComplete: () => void;
};

const blobToBase64: (blob: Blob) => Promise<string> = (blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (error) => reject(error);
  });

export const LivePhotoUpload = (props: Props) => {
  const [photoPreview, setPhotoPreview] = useState<File>();

  const fileValidator = (_: string) =>
    validators.validator((f: FileResult<string> | undefined) =>
      !!f && f.status === "valid" ? success(f) : failure(f?.issues[0])
    );

  const { fieldProps, handleSubmit, formErrors } = useFormo(
    {
      initialValues: {
        livephoto: undefined as FileResult<string> | undefined,
      },
      fieldValidators: () => ({
        livephoto: validators.inSequence(
          validators.defined("Please upload a photo"),
          fileValidator("Invalid image uploaded as portrait photo")
        ),
      }),
    },
    {
      onSubmit: (_) => {
        return Promise.resolve(success(props.onUploadComplete()));
      },
    }
  );

  function upload(file: File) {
    return blobToBase64(file)
      .then((base64) => props.kyc.uploadLivePhoto(props.flowId, base64))
      .then(
        (res) => {
          switch (res.status) {
            case "success":
              return null;
            case "error":
              const msg =
                res.error == "face_detection"
                  ? "No face detected in the uploaded picture"
                  : "Something went wrong while uploading the picture";
              setPhotoPreview(file);
              fieldProps("livephoto").onChange({
                status: "invalid",
                issues: [msg],
                file,
              });
              return msg;
          }
        },
        () => "Something went wrong while uploading the document"
      );
  }

  return (
    <Form
      title="Selfie Check"
      description="Upload a close-up recent photo."
      submitButton={{
        onPress: handleSubmit,
        label: "Continue",
      }}
      error={formErrors}
    >
      <FormSection title="Photo">
        {photoPreview ? (
          <FormRow>
            <Box background="backgroundSecondary">
              <Inline space={0} align="center">
                <img
                  style={{ maxWidth: "480px", maxHeight: "240px" }}
                  src={URL.createObjectURL(photoPreview)}
                />
              </Inline>
            </Box>
          </FormRow>
        ) : undefined}
        <FormRow>
          <FileUploaderField
            {...fieldProps("livephoto")}
            name="front"
            label="Document front"
            onChange={(value) => {
              fieldProps("livephoto").onChange(value);
              if (value?.status === "valid") {
                setPhotoPreview(value.file);
              }
            }}
            validate={(file) => upload(file)}
            allowedFileTypes={{
              "image/jpeg": [".jpg"],
              "image/png": [".png"],
            }}
            texts={{
              title: "Drag and drop your file here",
              description: "or",
              uploadAgainMessage: "Upload another file: ",
              uploadingMessage: "Uploading...",
              uploadButtonLabel: "BROWSE FILE",
              assistiveTextFileTypes: (fileTypes) =>
                fileTypes
                  ? "Allowed file types: " +
                    Object.values(fileTypes).flat().join(", ")
                  : "",
              assistiveTextMaxSize: (maxSizeMb) =>
                maxSizeMb ? "Max file size: " + maxSizeMb + "MB" : "",
            }}
            renderIssue={(issue) => issue}
            maxFileSize={10}
          />
        </FormRow>
      </FormSection>
    </Form>
  );
};
