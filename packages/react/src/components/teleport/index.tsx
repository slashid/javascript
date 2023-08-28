import { createPortal } from "react-dom"
import { findOrCreateTeleportTarget } from "./util"
import { ReactNode } from "react"

export interface TeleportProps {
  to: string
  children: ReactNode
  renderKey?: string | null | undefined
}

/**
 * Renders child content in a portal element at the DOM root
 * 
 * @param to The destination portal name
 * @param children The content to be teleported
 * @param renderKey (optional) A key to control when the content rerenders
 */
export const Teleport = ({ to, children, renderKey }: TeleportProps) => {
  const target = findOrCreateTeleportTarget(to)

  return (
    <>
      {createPortal(children, target, renderKey)}
    </>
  )
}