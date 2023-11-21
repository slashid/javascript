import { useState } from "react";
import { Card } from "../card";
import { Text } from "../text";

export function Flow() {
  const [state, setState] = useState("initial");

  return (
    <Card>
      <p>Text here</p>
      {state === "initial" && (
        <div>
          <Text t="initial.title" />
          <Text t="initial.details" />
        </div>
      )}
      {state === "clicked" && (
        <div>
          <Text t="success.title" />
          <Text t="success.details" />
        </div>
      )}
      <button onClick={() => setState("clicked")}>Click me</button>
    </Card>
  );
}
