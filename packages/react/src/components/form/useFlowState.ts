import { User } from "@slashid/slashid";
import { useEffect, useRef, useState } from "react";
import { LogIn, Retry } from "../../domain/types";

interface InitialState {
  status: "initial";
  logIn: LogIn;
}

interface AuthenticatingState {
  status: "authenticating";
  retry: Retry;
}

interface Event {
  type: string;
}

export type FlowState = InitialState | AuthenticatingState;

type Observer = (status: FlowState) => void;

const initialState: InitialState = {
  status: "initial",
  logIn: async () => {
    console.log("log in");
    return Promise.resolve(new User("asdf"));
  },
};

function createFlow(initialState: FlowState) {
  function processEvent(e: Event): FlowState["status"] {
    console.log(e);
    return "authenticating";
  }

  let observers: Observer[] = [];
  let state: FlowState = initialState;

  return {
    send: (event: Event) => {
      processEvent(event);
    },
    unsubscribe: (observer: Observer) => {
      observers = observers.filter((ob) => ob === observer);
    },
    subscribe: (observer: Observer) => {
      observers.push(observer);
    },
    state,
  };
}

type Flow = ReturnType<typeof createFlow>;

export function useFlowState() {
  const flowRef = useRef<Flow>(createFlow(initialState));
  const [state, setState] = useState<FlowState>(flowRef.current.state);

  useEffect(() => {
    flowRef.current.subscribe(setState);
  }, []);

  return state;
}
