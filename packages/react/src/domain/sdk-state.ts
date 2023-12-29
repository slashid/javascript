export const sdkStates = [
  "initial",
  "loaded",
  "retrievingToken",
  "ready",
] as const;

export type SDKState = (typeof sdkStates)[number];

export const sdkNotReadyStates = sdkStates.filter(
  (state): state is Exclude<SDKState, "ready"> => state != "ready"
);
