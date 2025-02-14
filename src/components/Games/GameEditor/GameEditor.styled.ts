import { Box, Button, styled } from "decentraland-ui2"

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  mb: 2,
})

const SaveButton = styled(Button)({
  maxWidth: "250px",
  alignSelf: "flex-end",
})

export { Container, SaveButton }
