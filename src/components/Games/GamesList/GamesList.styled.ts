import { Box, TableCell, TableContainer, styled } from "decentraland-ui2"

const GameListContainer = styled(Box)({
  width: "100%",
})

const GameListTableContainer = styled(TableContainer)({
  padding: "0 20px",
})

const GameIdTableCell = styled(TableCell)({
  minWidth: "300px",
})

const GameNameTableCell = styled(TableCell)({
  minWidth: "100px",
})

const GameParcelTableCell = styled(TableCell)({
  minWidth: "50px",
})

export {
  GameIdTableCell,
  GameListContainer,
  GameListTableContainer,
  GameNameTableCell,
  GameParcelTableCell,
}
