import { TextField, TextFieldProps } from "decentraland-ui2"

const TextFieldStyled = (props: TextFieldProps) => {
  const { focused } = props
  return (
    <TextField
      {...props}
      variant="standard"
      color={focused ? "warning" : "success"}
    />
  )
}

export { TextFieldStyled }
