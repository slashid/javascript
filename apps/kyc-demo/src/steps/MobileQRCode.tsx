import {
  Feedback,
  Headline,
  Inline,
  InlineLoader,
  Stack,
  Body,
  Box,
} from "design-system";
import { useEffect, useRef, useState } from "react";

import type { KYC, KYCStatus } from "@slashid/slashid";

export function MobileQRCode(props: {
  kyc: KYC;
  flowId: string;
  onComplete: () => void;
}) {
  const [error, setError] = useState("");
  const [qrCodeImg, setQRcodeImg] = useState("");
  const pollingTimeout = useRef<NodeJS.Timeout>();

  function polling(start: number) {
    props.kyc.flow(props.flowId).then(
      (flow) => {
        if (flow.status === KYCStatus.LIVEPHOTOUPLOADED) {
          props.onComplete();
        } else {
          pollingTimeout.current = setTimeout(() => polling(start), 1000);
        }
      },
      () => {
        setError("Something went wrong while reading the KYC flow status");
      }
    );
  }

  function getQrCode() {
    props.kyc
      .getMobileUrlQRCode(props.flowId)
      .then(({ QRCode: imgBase64String }) => {
        setQRcodeImg(imgBase64String);
        setError("");
        polling(Date.now());
      })
      .catch(() => {
        setError("Something went wrong while generating the QRCode image");
        setQRcodeImg("");
      });
  }

  useEffect(() => {
    getQrCode();
    return () => {
      clearTimeout(pollingTimeout.current);
    };
  }, []);

  return (
    <>
      {error && (
        <Feedback
          size="large"
          title="Error"
          description={error}
          status="negative"
        />
      )}
      {qrCodeImg && (
        <Stack space={40}>
          <Stack space={8} align="left">
            <Headline size="large">Scan the QR code</Headline>
            <Body size="medium">
              Scan the QR code and continue the procedure on your mobile device.
            </Body>
          </Stack>
          <Box background="backgroundSecondary">
            <Inline space={0} align="center">
              <img src={qrCodeImg} alt="QRCode for mobile URL" width={240} />
            </Inline>
          </Box>
          <InlineLoader message="Come back after completing the procedure on your mobile device." />
        </Stack>
      )}
    </>
  );
}
