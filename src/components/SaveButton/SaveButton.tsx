import * as React from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { SaveButtonProps } from "./SaveButton.typed"
import { SaveButtonStyled } from "./SaveButton.styled"

const SaveButton = React.memo(({ disabled, onClick }: SaveButtonProps) => {
  const l = useFormatMessage()
  return (
    <SaveButtonStyled variant="contained" disabled={disabled} onClick={onClick}>
      {l("save_button.save_changes")}
    </SaveButtonStyled>
  )
})

export { SaveButton }
