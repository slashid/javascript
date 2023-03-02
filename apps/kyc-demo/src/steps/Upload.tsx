import {
  Box,
  FileUploaderField,
  Form,
  FormRow,
  FormSection,
  Inline,
} from "design-system";
import { KYC, DocumentSide } from "@slashid/slashid";
import { failure, success } from "@buildo/formo/lib/Result";
import { useFormo, validators } from "@buildo/formo";

import { FileResult } from "@buildo/bento-design-system";
import { useState } from "react";

export function Upload(props: {
  flowId: string;
  kyc: KYC;
  sides: Array<DocumentSide>;
  onUploadComplete: () => void;
}) {
  const [frontPreview, setFrontPreview] = useState<File | undefined>(undefined);
  const [backPreview, setBackPreview] = useState<File | undefined>(undefined);

  const shouldUploadBack = props.sides.includes(DocumentSide.BACK);

  const fileValidator = (errorMessage: string) =>
    validators.validator((f: FileResult<string> | undefined) =>
      !!f && f.status === "valid" ? success(f) : failure(f?.issues[0])
    );

  const { fieldProps, handleSubmit, formErrors } = useFormo(
    {
      initialValues: {
        front: undefined as FileResult<string> | undefined,
        back: undefined as FileResult<string> | undefined,
      },
      fieldValidators: () => ({
        front: validators.inSequence(
          validators.defined("Please upload the document front"),
          fileValidator("Invalid image uploaded as document front")
        ),
        back: shouldUploadBack
          ? validators.inSequence(
              validators.defined("Please upload the document back"),
              fileValidator("Invalid image uploaded as document back")
            )
          : undefined,
      }),
    },
    {
      onSubmit: (_) => {
        return Promise.resolve(success(props.onUploadComplete()));
      },
    }
  );

  function formatErrorMessage(error: string): string {
    if (error === "document_detection")
      return "No document detected in the uploaded image";
    if (error === "detect_cutoff")
      return "The uploaded document is cut off. Please upload another image.";
    if (error === "detect_blur")
      return "The uploaded document is blurred. Please upload another image.";
    else return "Something went wrong while uploading the document";
  }

  function updatePreviewAndField(
    side: DocumentSide,
    file: File,
    error: string
  ) {
    switch (side) {
      case DocumentSide.FRONT: {
        setFrontPreview(file);
        return fieldProps("front").onChange({
          status: "invalid",
          issues: [error],
          file,
        });
      }
      case DocumentSide.BACK: {
        setBackPreview(file);
        return fieldProps("back").onChange({
          status: "invalid",
          issues: [error],
          file,
        });
      }
    }
  }

  function uploadAndValidate(side: DocumentSide, file: File) {
    return blobToBase64(file)
      .then((base64) => props.kyc.uploadDocument(props.flowId, side, base64))
      .then(
        (r) => {
          if (r.status === "error") {
            const error = formatErrorMessage(r.error);
            updatePreviewAndField(side, file, error);
            return error;
          } else {
            return null;
          }
        },
        () => "Something went wrong while uploading the document"
      );
  }

  return (
    <Form
      title="Your document"
      description="Upload the required images of your documents."
      submitButton={{
        onPress: handleSubmit,
        label: "Continue",
      }}
      error={formErrors}
    >
      <FormSection title="Front">
        {frontPreview ? (
          <FormRow>
            <Box background="backgroundSecondary">
              <Inline space={0} align="center">
                <img
                  style={{ maxWidth: "480px", maxHeight: "240px" }}
                  src={URL.createObjectURL(frontPreview)}
                />
              </Inline>
            </Box>
          </FormRow>
        ) : undefined}
        <FormRow>
          <FileUploaderField
            {...fieldProps("front")}
            name="front"
            label="Document front"
            onChange={(value) => {
              fieldProps("front").onChange(value);
              if (value?.status === "valid") {
                setFrontPreview(value.file);
              }
            }}
            validate={(file) => uploadAndValidate(DocumentSide.FRONT, file)}
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
      {shouldUploadBack && (
        <FormSection title="Back">
          {backPreview ? (
            <FormRow>
              <Box background="backgroundSecondary">
                <Inline space={0} align="center">
                  <img
                    style={{ maxWidth: "480px", maxHeight: "240px" }}
                    src={URL.createObjectURL(backPreview)}
                  />
                </Inline>
              </Box>
            </FormRow>
          ) : undefined}
          <FormRow>
            <FileUploaderField
              {...fieldProps("back")}
              name="back"
              label="Document back"
              onChange={(value) => {
                fieldProps("back").onChange(value);
                if (value?.status === "valid") {
                  setBackPreview(value.file);
                }
              }}
              validate={(file) => uploadAndValidate(DocumentSide.BACK, file)}
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
      )}
    </Form>
  );
}

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (error) => reject(error);
  });
