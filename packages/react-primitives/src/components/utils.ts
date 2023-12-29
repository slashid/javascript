// @ts-expect-error TODO fix enums in KYC SDK
import { KYC } from "@slashid/slashid";
import Compress from "compress.js";

export const isUploadSupported = () => {
  if (
    navigator.userAgent.match(
      /(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/
    )
  ) {
    return false;
  }
  let elem = document.createElement("input");
  elem.type = "file";
  return !elem.disabled;
};

const compress = new Compress();

export type DocumentConstraints = {
  formats: string;
  maxResolution: number; // Mpx
  maxSize: number; // MB
};

export const blobResize: (
  blob: Blob,
  constraints: DocumentConstraints
) => Promise<Blob> = (blob, constraints) =>
  new Promise<Blob>((resolve, reject) => {
    if (!["image/jpeg", "image/png"].includes(blob.type)) {
      reject();
    }
    const image = new Image();
    image.onload = function () {
      const maxImageRes = constraints.maxResolution * 10 ** 6;
      const imageRes = image.width * image.height;
      const ratio = Math.min(maxImageRes / imageRes, 1);
      const maxWidth = image.width * ratio;
      const maxHeight = image.height * ratio;

      compress
        .compress([new File([blob], "upload")], {
          size: constraints.maxSize, // Max size in MB
          quality: 1, // Do not change quality
          maxWidth,
          maxHeight,
        })
        .then((res) => res[0])
        .then((b64) => Compress.convertBase64ToFile(b64.data))
        .then(resolve)
        .catch(reject);
    };

    image.src = URL.createObjectURL(blob);
  });

export const blobToBase64: (blob: Blob) => Promise<string> = (blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (error) => reject(error);
  });

export type CommonProps = {
  flowId: string;
  kyc: KYC;
  onContinue: () => void;
};

export const documentConstraints = {
  formats: "image/jpeg, image/png",
  maxResolution: 64,
  maxSize: 10,
};

export const fromEntries = <
  T extends ReadonlyArray<readonly [PropertyKey, unknown]>
>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
};
