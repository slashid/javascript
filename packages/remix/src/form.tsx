import { useRevalidator } from '@remix-run/react'
import { Form as FormReact } from '@slashid/react'
import { useCallback } from 'react'
import { Styles } from './styles'

export const Form = ({ children, onSuccess, ...props }: any) => {
  const revalidator = useRevalidator()

  const success = useCallback(() => {
    revalidator.revalidate()
    onSuccess()
  }, [onSuccess, revalidator])

  return (
    <>
      <Styles />
      <FormReact
        {...props}
        onSuccess={success}
      >
        {children}
      </FormReact>
    </>
  )
}