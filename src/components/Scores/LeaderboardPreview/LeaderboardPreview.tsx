import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import {
  Alert,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "decentraland-ui2"
import {
  LeaderboardContainer,
  LeaderboardMetricCell,
  LeaderboardNameCell,
  LeaderboardRankCell,
  LeaderboardTableContainer,
} from "./LeaderboardPreview.styled"
import { LeaderboardPreviewProps } from "./LeaderboardPreview.typed"
import { scoresApi } from "../../../api/scoresApi"
import { Leaderboard } from "../../../types"

const LeaderboardPreview = React.memo(
  ({ gameId, refreshKey }: LeaderboardPreviewProps) => {
    const l = useFormatMessage()
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLeaderboard = useCallback(async () => {
      if (!gameId) return
      setLoading(true)
      setError(null)
      try {
        const response = await scoresApi.getLeaderboard(gameId, {
          limit: 10,
        })
        setLeaderboard(response.data)
      } catch {
        setError(l("scores_leaderboard_error"))
      } finally {
        setLoading(false)
      }
    }, [gameId, l])

    useEffect(() => {
      fetchLeaderboard()
    }, [fetchLeaderboard, refreshKey])

    return (
      <LeaderboardContainer>
        <Typography variant="h6" gutterBottom>
          {l("scores_leaderboard_title")}
        </Typography>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : leaderboard.length === 0 ? (
          <Alert severity="info">{l("scores_leaderboard_empty")}</Alert>
        ) : (
          <LeaderboardTableContainer>
            <Table size="small" aria-label="leaderboard">
              <TableHead>
                <TableRow>
                  <LeaderboardRankCell padding="none">#</LeaderboardRankCell>
                  <TableCell padding="none">{l("scores_col_user_name")}</TableCell>
                  <TableCell padding="none" align="right">
                    {l("scores_col_score")}
                  </TableCell>
                  <TableCell padding="none" align="right">
                    {l("scores_col_time")}
                  </TableCell>
                  <TableCell padding="none" align="right">
                    {l("scores_col_moves")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((row, index) => (
                  <TableRow key={index}>
                    <LeaderboardRankCell padding="none">
                      {index + 1}
                    </LeaderboardRankCell>
                    <LeaderboardNameCell padding="none">
                      {row.name}
                    </LeaderboardNameCell>
                    <LeaderboardMetricCell padding="none" align="right">
                      {row.score}
                    </LeaderboardMetricCell>
                    <LeaderboardMetricCell padding="none" align="right">
                      {row.time}
                    </LeaderboardMetricCell>
                    <LeaderboardMetricCell padding="none" align="right">
                      {row.moves}
                    </LeaderboardMetricCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </LeaderboardTableContainer>
        )}
      </LeaderboardContainer>
    )
  }
)

export { LeaderboardPreview }
