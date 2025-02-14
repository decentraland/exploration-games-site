import { Box, Button, styled } from "decentraland-ui2"

const MissionEditorContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "20px",
})

const MissionEditorSaveButton = styled(Button)({
  maxWidth: "250px",
  alignSelf: "flex-end",
})

export { MissionEditorContainer, MissionEditorSaveButton }
