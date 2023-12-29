declare global {
  const __REACT_FORM_STYLES__: string
}

export const Styles = () => {
  return (
    <style>
      {__REACT_FORM_STYLES__}
    </style>
  )
}