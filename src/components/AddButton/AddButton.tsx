import * as React from "react"
import { Add } from "@mui/icons-material"
import { AddButtonProps } from "./AddButton.typed"
import { AddButtonStyled } from "./AddButton.styled"

const AddButton = React.memo(({ children, onClick }: AddButtonProps) => {
  return (
    <AddButtonStyled
      variant="contained"
      size="small"
      startIcon={<Add fontSize="small" />}
      onClick={onClick}
    >
      {children}
    </AddButtonStyled>
  )
})

export { AddButton }
