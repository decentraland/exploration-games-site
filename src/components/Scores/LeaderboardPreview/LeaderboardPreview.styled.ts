import { Box, TableCell, TableContainer, styled } from "decentraland-ui2"

const LeaderboardContainer = styled(Box)({
  position: "fixed",
  bottom: "42px",
  right: "24px",
  zIndex: 1200,
  minWidth: "260px",
  maxWidth: "420px",
  padding: "16px",
  backgroundColor: "#1e1e1e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
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
