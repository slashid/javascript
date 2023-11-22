import type { SlashID } from "@slashid/slashid";

export type State = "initial" | "clicked";

export type FlowType = "catch-all";

export type ChallengesInURL = Awaited<
  ReturnType<SlashID["getChallengesFromURL"]>
>;
export type Challenges = NonNullable<ChallengesInURL>;
