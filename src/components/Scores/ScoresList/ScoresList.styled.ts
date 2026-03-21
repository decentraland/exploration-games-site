import { Box, TableCell, TableContainer, styled } from "decentraland-ui2"

const ScoresListContainer = styled(Box)({
  width: "100%",
})

const ScoresListTableContainer = styled(TableContainer)({
  padding: "0 20px",
})

const ScoresAddressTableCell = styled(TableCell)({
  minWidth: "200px",
  maxWidth: "200px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

const ScoresUserNameTableCell = styled(TableCell)({
  minWidth: "120px",
})

const ScoresMetricTableCell = styled(TableCell)({
  minWidth: "80px",
})

export {
  ScoresListContainer,
  ScoresListTableContainer,
  ScoresAddressTableCell,
  ScoresUserNameTableCell,
  ScoresMetricTableCell,
}
