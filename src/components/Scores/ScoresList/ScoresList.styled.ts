import { Box, TableCell, TableContainer, styled } from "decentraland-ui2"

const ScoresListContainer = styled(Box)({
  width: "100%",
})

const ScoresListTableContainer = styled(TableContainer)({
  padding: "0 20px",
})

const ScoresAddressTableCell = styled(TableCell)({
  minWidth: "140px",
  maxWidth: "160px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

const ScoresUserNameTableCell = styled(TableCell)({
  minWidth: "120px",
  maxWidth: "140px",
})

const ScoresMetricTableCell = styled(TableCell)({
  minWidth: "90px",
  maxWidth: "90px",
  paddingLeft: "8px",
  paddingRight: "8px",
})

const ScoresStatusTableCell = styled(TableCell)({
  minWidth: "140px",
  maxWidth: "140px",
  paddingLeft: "8px",
  paddingRight: "8px",
})

export {
  ScoresListContainer,
  ScoresListTableContainer,
  ScoresAddressTableCell,
  ScoresUserNameTableCell,
  ScoresMetricTableCell,
  ScoresStatusTableCell,
}
