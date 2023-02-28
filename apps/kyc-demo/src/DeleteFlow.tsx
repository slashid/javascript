import { Banner, Bleed, Button, IconChevronLeft, Inline } from "design-system";
import type { KYC } from "@slashid/kyc";
import { useEffect, useState } from "react";

export function DeleteFlow(props: {
  kyc: KYC;
  flowId: string;
  onFlowDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(false), 2000);
      return () => clearTimeout(timeout);
    }
    return () => void 0;
  }, [error]);

  return (
    <Inline space={24} alignY="center">
      <Bleed spaceX={16}>
        <Button
          hierarchy="primary"
          kind="transparent"
          label="Start again"
          onPress={() => {
            if (loading) return;
            setLoading(true);
            setError(false);
            props.kyc.delete(props.flowId).then(
              () => {
                setLoading(false);
                props.onFlowDeleted();
              },
              () => {
                setLoading(false);
                setError(true);
              }
            );
          }}
          icon={IconChevronLeft}
        />
      </Bleed>
      {error && (
        <Banner
          kind="negative"
          description="Something went wrong while deleting the flow. Please try again later."
        />
      )}
    </Inline>
  );
}
