import React from "react";
import { MaybeArray } from "../../domain/types";

export type Props<Name extends string> = {
  children: React.ReactNode;
  name: Name; // name of the slot the component is being rendered into
};

export type Slots<SlotNames extends string> = MaybeArray<
  React.ReactElement<
    React.JSXElementConstructor<React.PropsWithChildren<Props<SlotNames>>>
  >
>;

/**
 * Fill a named slot with the components passed as children. This is a layout concept entirely - no business logic is associated with this component.
 * If a parent component exposes a named slot, it will also be responsible for rendering a default component in case no component is passed to the slot.
 * Slot itself does not pass any props or share state with child components.
 * Check the docs of the parent component to see if it exposes any stateful components you can use.
 */
export function Slot<N extends string>({ children, name }: Props<N>) {
  return <div className={`sid-slot-${name}`}>{children}</div>;
}

type PopulateSlotsOptions = {
  children: React.ReactNode;
  defaultSlots: Record<string, React.ReactNode | null>;
};

/**
 * Given a list of slots with their default components, populate the slots with the components passed as children.
 * Ensures a component gets rendered in place of the slot.
 */
export function useSlots({ children, defaultSlots }: PopulateSlotsOptions) {
  const slots = React.useMemo(() => {
    const renderedSlots: Record<string, React.ReactNode> = { ...defaultSlots };

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;

      // TODO during development print a console log with details in the case of a missing slot

      if (child.type !== Slot) {
        console.warn(`Passed a non-<Slot> component to a slot: ${child.type}`);
        return;
      }

      if (child.props.name in defaultSlots) {
        renderedSlots[child.props.name] = child;
      } else {
        console.warn(
          `Passed a <Slot> with an unsupported name: ${child.props.name}`
        );
      }
    });

    return renderedSlots;
  }, [children, defaultSlots]);

  return slots;
}
