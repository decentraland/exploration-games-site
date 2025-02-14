import { Box, Button, styled } from "decentraland-ui2"

const GameEditorContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  mb: 2,
})

const GameEditorSaveButton = styled(Button)({
  maxWidth: "250px",
  alignSelf: "flex-end",
})

export { GameEditorContainer, GameEditorSaveButton }
