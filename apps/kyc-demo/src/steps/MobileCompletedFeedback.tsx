import { Feedback } from "design-system";

export function MobileCompletedFeedback(props: { onContinue: () => void }) {
  return (
    <Feedback
      size="large"
      status="positive"
      title="Pictures uploaded"
      description="Your document and selfie pictures have been uploaded successfully."
      action={{ onPress: props.onContinue, label: "Continue" }}
    />
  );
}
