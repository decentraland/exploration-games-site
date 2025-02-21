import { MouseEvent } from "react"

export type SaveButtonProps = {
  disabled: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}
