import * as React from "react"
import { Container } from "decentraland-ui2"
import { ErrorScreenProps } from "./ErrorScreen.typed"
import { BoxStyled } from "./ErrorScreen.styled"

const ErrorScreen = React.memo(({ children }: ErrorScreenProps) => {
  return (
    <Container>
      <BoxStyled>{children}</BoxStyled>
    </Container>
  )
})

export { ErrorScreen }
