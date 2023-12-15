import { createPortal } from "react-dom"
import { findOrCreateTeleportTarget } from "./util"
import { ReactNode } from "react"

export interface TeleportProps {
  to: string
  children: ReactNode
  renderKey?: string | null | undefined
}

/**
 * A managed React portal. Creates and manages resolution of portal
 * destination elements for you, just provide a name.
 * 
 * The portal destination elements are created at the DOM root and
 * [children] are rendered here.
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