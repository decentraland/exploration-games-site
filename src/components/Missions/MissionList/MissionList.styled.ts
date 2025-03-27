import { Box, Table, TableCell, styled } from "decentraland-ui2"

const Container = styled(Box)({
  marginBottom: "20px",
})

const TableContainer = styled(Box)({
  padding: "0 20px",
})

const MissionsTable = styled(Table)({
  minWidth: "700px",
})

const ThumbCell = styled(TableCell)({
  maxWidth: "100px",
  whiteSpace: "nowrap",
  overflow: "hidden",
})

export { Container, TableContainer, MissionsTable, ThumbCell }
