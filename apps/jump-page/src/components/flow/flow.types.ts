import type { SlashID } from "@slashid/slashid";

export type InitialState = {
  state: "initial";
};

export type ParsingURLState = {
  state: "parsing-url";
};

export type NoChallengesState = {
  state: "no-challenges";
  challenges: null;
};

export type ProgressState = {
  state: "progress";
  challenges: Challenges;
  flowType: FlowType;
};

export type SuccessState = {
  state: "success";
  challenges: Challenges;
  flowType: FlowType;
};

export type ErrorState = {
  state: "error";
  error: Error;
  challenges: Challenges;
  flowType: FlowType;
};

export type State =
  | InitialState
  | ParsingURLState
  | NoChallengesState
  | ProgressState
  | SuccessState
  | ErrorState;

export type FlowType = "catch-all" | "password-recovery";

export type ChallengesInURL = Awaited<
  ReturnType<SlashID["getChallengesFromURL"]>
>;
export type Challenges = NonNullable<ChallengesInURL>;
