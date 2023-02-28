import {
  AreaLoader,
  Banner,
  Button,
  Feedback,
  Inline,
  Stack,
} from "design-system";
import type { KYC } from "@slashid/kyc";
import { KYCStatus } from "@slashid/kyc/dist/client";
import { useEffect, useRef, useState } from "react";

type Result = "loading" | "takingLonger" | "ok" | "nok";

type Props = {
  kyc: KYC;
  flowId: string;
  onStartNewFlow: () => void;
};

export function LoadingAndResult(props: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<Result>("loading");
  const pollingTimeout = useRef<NodeJS.Timeout>();

  function polling(start: number) {
    props.kyc.flow(props.flowId).then(
      (flow) => {
        if (flow.status === KYCStatus.VERIFIED) {
          setResult("ok");
        } else if (flow.status === KYCStatus.NOTVERIFIED) {
          setResult("nok");
        } else if (Date.now() > start + 20 * 1000) {
          setResult("takingLonger");
        } else {
          pollingTimeout.current = setTimeout(() => polling(start), 1000);
        }
      },
      () => {
        setError(true);
      }
    );
  }

  useEffect(() => {
    polling(Date.now());
    return () => {
      clearTimeout(pollingTimeout.current);
    };
  }, []);

  const displayResult = (() => {
    switch (result) {
      case "loading":
        return (
          <AreaLoader message="Loading verification results (this may take a while)" />
        );
      case "takingLonger":
        return (
          <Feedback
            status="positive"
            size="large"
            title="Verification is taking longer"
            description="Verification checks are taking longer, we'll notify you as soon as we are ready to proceed."
          />
        );
      case "nok":
        return (
          <Feedback
            status="negative"
            size="large"
            title="Verification failed"
            description="Unfortunately we could not successfully verify your document. Please contact support."
          />
        );
      case "ok":
        return (
          <Feedback
            status="positive"
            size="large"
            title="Verification successful"
            description="Your document has been successfully verified."
          />
        );
    }
  })();

  return loading ? (
    <AreaLoader />
  ) : (
    <Stack space={24}>
      {error ? (
        <Banner
          kind="negative"
          description="Something went wrong while executing the verification."
        />
      ) : (
        <Inline space={0} align="center">
          {displayResult}
        </Inline>
      )}
      <Inline space={0} align="center">
        <Button
          label="Start new flow"
          onPress={() => {
            setLoading(true);
            setError(false);
            props.kyc.delete(props.flowId).then(
              () => {
                setLoading(false);
                props.onStartNewFlow();
              },
              () => {
                setLoading(false);
                setError(true);
              }
            );
          }}
          kind="solid"
          hierarchy="primary"
        />
      </Inline>
    </Stack>
  );
}
