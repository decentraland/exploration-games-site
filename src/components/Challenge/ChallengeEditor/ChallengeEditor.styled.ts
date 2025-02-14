import { Box, Button, styled } from "decentraland-ui2"

const ChallengeEditorContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "20px",
})

const SaveButton = styled(Button)({
  maxWidth: "250px",
  alignSelf: "flex-end",
})

export { ChallengeEditorContainer, SaveButton }
