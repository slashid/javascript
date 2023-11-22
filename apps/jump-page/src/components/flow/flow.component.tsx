import { useState } from "react";
import { Card } from "../card";
import { Text } from "../text";
import { InitialState } from "./flow.initial";
import type { State } from "./flow.types";

export function Flow() {
  const [state] = useState<State>("initial");

  return (
    <Card>
      {state === "initial" && <InitialState />}
      {state === "clicked" && (
        <div>
          <Text t="success.title" />
          <Text t="success.details" />
        </div>
      )}
    </Card>
  );
}
