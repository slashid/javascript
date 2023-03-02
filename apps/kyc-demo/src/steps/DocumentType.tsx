import {
  AreaLoader,
  Form,
  FormRow,
  FormSection,
  SelectField,
} from "design-system";
import { KYC, DocumentType as DocType, DocumentSide } from "@slashid/slashid";
import { useEffect, useState } from "react";
import { useFormo, validators } from "@buildo/formo";
import { failure, success } from "@buildo/formo/lib/Result";

export function DocumentType(props: {
  kyc: KYC;
  flowId: string;
  onDocumentTypeSelected: (sides: Array<DocumentSide>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<Array<DocType>>([]);

  useEffect(() => {
    props.kyc.documentTypes(props.flowId).then((res) => {
      setDocumentTypes(res.documentTypes);
    });
  }, []);

  const { fieldProps, handleSubmit, formErrors } = useFormo(
    {
      initialValues: {
        documentType: undefined as DocType | undefined,
      },
      fieldValidators: () => ({
        documentType: validators.defined<DocType | undefined, string>(
          "Document type cannot be empty"
        ),
      }),
    },
    {
      onSubmit: ({ documentType }) => {
        setLoading(true);
        return props.kyc.setDocumentType(props.flowId, documentType).then(
          (res) => {
            setLoading(false);
            return success(props.onDocumentTypeSelected(res.documentSides));
          },
          () => {
            setLoading(false);
            return failure(
              "Something went wrong while selecting the document type. Please try again later."
            );
          }
        );
      },
    }
  );

  return (
    <Form
      title="Your document"
      description="Choose the type of document you want to upload."
      submitButton={{
        onPress: handleSubmit,
        label: "Continue",
      }}
      error={formErrors}
    >
      <FormSection>
        <FormRow>
          <SelectField
            {...fieldProps("documentType")}
            label="Document type"
            placeholder="Select a document type..."
            name="document"
            options={documentTypes.map((d) => ({
              label: d.toString(),
              value: d,
              kind: "single-line",
            }))}
          />
        </FormRow>
        {loading && <AreaLoader />}
      </FormSection>
    </Form>
  );
}
