import { TextConfigKey } from "./text/constants";

const makeToReason: <T extends string>(
  reasons: T[]
) => (msg: string) => T | undefined = (reasons) => (msg) => {
  const index = reasons.map((x) => msg.includes(x)).indexOf(true);
  return index > -1 ? reasons.at(index) : undefined;
};

type ToTextConfigKey<T> = (error: T | undefined) => {
  title: TextConfigKey;
  description: TextConfigKey;
};

export namespace ImageQualityError {
  export type Reason = "detect_blur" | "detect_cutoff" | "document_detection";
  const reasons: Reason[] = [
    "detect_blur",
    "detect_cutoff",
    "document_detection",
  ];
  export const toReason: (msg: string) => Reason | undefined =
    makeToReason<Reason>(reasons);
  export const toTextConfigKey: ToTextConfigKey<Reason> = (e) => {
    switch (e) {
      case "detect_blur":
        return {
          title: "kyc.upload.mobile.failure.quality.detect_blur.title",
          description:
            "kyc.upload.mobile.failure.quality.detect_blur.description",
        };
      case "detect_cutoff":
        return {
          title: "kyc.upload.mobile.failure.quality.detect_cutoff.title",
          description:
            "kyc.upload.mobile.failure.quality.detect_cutoff.description",
        };
      case "document_detection":
        return {
          title: "kyc.upload.mobile.failure.quality.document_detection.title",
          description:
            "kyc.upload.mobile.failure.quality.document_detection.description",
        };
      case undefined:
        return {
          title: "kyc.upload.mobile.failure.quality.title",
          description: "kyc.upload.mobile.failure.quality.description",
        };
    }
  };
}

export namespace LivePhotoError {
  export type Reason = "face_detection";
  const reasons: Reason[] = ["face_detection"];
  export const toReason: (msg: string) => Reason | undefined =
    makeToReason<Reason>(reasons);
  export const toTextConfigKey: ToTextConfigKey<Reason> = (e) => {
    switch (e) {
      case "face_detection":
        return {
          title: "kyc.livephoto.mobile.failure.validation.face_detection.title",
          description:
            "kyc.livephoto.mobile.failure.validation.face_detection.description",
        };
      case undefined:
        return {
          title: "kyc.livephoto.mobile.failure.validation.title",
          description: "kyc.livephoto.mobile.failure.validation.description",
        };
    }
  };
}
