import React from "react";

export type Props<Name extends string> = {
  children: React.ReactNode;
  name: Name; // name of the slot the component is being rendered into
  asChild?: boolean; // pass props to the immediate child
};

// TODO consider using asChild prop as an alternative to render props = passes props to the immediate child

// add render props here

/**
 * TODO document this component
 * - issue: it is not typesafe, it is possible to render a slot with a name that does not exist
 * @returns
 */
export function Slot<N extends string>({ children, name, asChild }: Props<N>) {
  if (asChild) {
    // pass props to the immediate child
  }
  return <div className={`sid-slot-${name}`}>{children}</div>;
}

type PopulateSlotsOptions = {
  children: React.ReactNode;
  defaultSlots: Record<string, React.ReactNode | null>;
};

export function useSlots({ children, defaultSlots }: PopulateSlotsOptions) {
  const slots = React.useMemo(() => {
    const renderedSlots: Record<string, React.ReactNode> = { ...defaultSlots };

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;

      if (child.type !== Slot) return;

      if (child.props.name in defaultSlots) {
        renderedSlots[child.props.name] = child;
      }
    });

    return renderedSlots;
  }, [children, defaultSlots]);

  return slots;
}
