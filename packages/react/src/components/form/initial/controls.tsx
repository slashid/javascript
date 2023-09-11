type Props = {
  children: () => React.ReactNode;
}

export const Controls = ({children}: Props) => {
  // get the configured form
  // split it so it can render controls separately
  // pass the controls as props
  // also pass the functions to be used instead of controls

  // TODO can we use asChild pattern instead of render props

  return children();
};
