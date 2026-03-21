import { Box, TableCell, TableContainer, styled } from "decentraland-ui2"

const LeaderboardContainer = styled(Box)({
  minWidth: "320px",
  maxWidth: "360px",
  padding: "16px",
  borderLeft: "1px solid rgba(255,255,255,0.12)",
})

const LeaderboardTableContainer = styled(TableContainer)({
  padding: "0",
})

const LeaderboardRankCell = styled(TableCell)({
  minWidth: "40px",
  fontWeight: "bold",
})

const LeaderboardNameCell = styled(TableCell)({
  minWidth: "100px",
  maxWidth: "130px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})

const LeaderboardMetricCell = styled(TableCell)({
  minWidth: "60px",
})

export {
  LeaderboardContainer,
  LeaderboardTableContainer,
  LeaderboardRankCell,
  LeaderboardNameCell,
  LeaderboardMetricCell,
}
