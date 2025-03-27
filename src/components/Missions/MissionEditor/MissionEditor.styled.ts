import { Box, styled } from "decentraland-ui2"

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "20px",
})

const Columns = styled(Box)({
  display: "flex",
})

const ColInputs = styled(Box)({
  width: "80%",
  display: "flex",
  flexDirection: "column",
})
const ColThumb = styled("img")({
  width: "20%",
  height: "20%",
})

export { Container, Columns, ColInputs, ColThumb }
