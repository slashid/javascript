import { Flag } from "country-list-with-dial-code-and-flag";
import { HandleType } from "../../domain/types";

export type PayloadOptions = {
  handleType?: HandleType;
  handleValue?: string;
  flag?: Flag;
};

export const TIME_MS = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
};
