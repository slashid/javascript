import { Factor } from "@slashid/slashid";
import React from "react";
import { Handle } from "../../domain/types";
import { useFlowState } from "./useFlowState";
import { PayloadOptions } from "./types";

export type InternalFormContextType = {
  flowState: ReturnType<typeof useFlowState> | null;
  lastHandle?: Handle;
  lastFactor?: Factor;
  submitPayloadRef: React.MutableRefObject<PayloadOptions>;
  handleSubmit: (factor: Factor, handle?: Handle) => void;
  selectedFactor?: Factor;
  setSelectedFactor: React.Dispatch<React.SetStateAction<Factor | undefined>>;
};

export const InternalFormContext = React.createContext<InternalFormContextType>(
  {
    flowState: null,
    lastHandle: undefined,
    lastFactor: undefined,
    submitPayloadRef: { current: {} },
    handleSubmit: () => null,
    selectedFactor: undefined,
    setSelectedFactor: () => null,
  }
);

export const useInternalFormContext = () => {
  return React.useContext(InternalFormContext);
};
