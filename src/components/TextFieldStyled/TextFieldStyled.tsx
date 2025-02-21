import * as React from "react"
import { TextField, TextFieldProps } from "decentraland-ui2"

const TextFieldStyled = React.memo((props: TextFieldProps) => {
  const { focused } = props
  return (
    <TextField
      {...props}
      variant="standard"
      color={focused ? "warning" : "success"}
    />
  )
})

export { TextFieldStyled }
