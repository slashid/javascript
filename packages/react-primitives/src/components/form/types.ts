import { Flag } from "country-list-with-dial-code-and-flag";
import { HandleType } from "../../domain/types";

export type PayloadOptions = {
  handleType?: HandleType;
  handleValue?: string;
  flag?: Flag;
};
