import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { Close as CloseIcon } from "@mui/icons-material"
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableRow,
  Typography,
} from "decentraland-ui2"
import {
  LeaderboardContainer,
  LeaderboardMetricCell,
  LeaderboardNameCell,
  LeaderboardRankCell,
  LeaderboardTableContainer,
} from "./LeaderboardPreview.styled.ts"
import { LeaderboardPreviewProps } from "./LeaderboardPreview.typed.ts"
import { scoresApi } from "../../../api/scoresApi.ts"
import { leaderboardConfig } from "../../../config/leaderboard.ts"
import { Leaderboard } from "../../../types.ts"
import { formatMsToMinutes } from "../../../utils/formatTime.ts"
import { HeadCell, TableOrder } from "../../Tables/Table.types.ts"
import { TableHeader } from "../../Tables/TableHeader.tsx"

type LeaderboardRow = Leaderboard & { rank: number }

const LeaderboardPreview = React.memo(
  ({ gameId, refreshKey, onClose }: LeaderboardPreviewProps) => {
    const l = useFormatMessage()
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchLeaderboard = useCallback(async () => {
      if (!gameId) return
      const config = leaderboardConfig[gameId]
      if (!config) return
      setLoading(true)
      setError(null)

      try {
        const response = await scoresApi.getLeaderboard(gameId, {
          limit: 10,
          sort: config.sortField,
          direction: config.sortDirection,
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

    const config = useMemo(() => leaderboardConfig[gameId] ?? null, [gameId])

    const headerRow: readonly HeadCell<LeaderboardRow>[] = useMemo(() => {
      if (!config) return []
      const cells: HeadCell<LeaderboardRow>[] = [
        {
          id: "rank",
          numeric: false,
          disablePadding: true,
          label: "#",
        },
        {
          id: "user_name",
          numeric: false,
          disablePadding: true,
          label: l("scores_col_user_name"),
        },
      ]
      if (config.showScore)
        cells.push({
          id: "score",
          numeric: false,
          disablePadding: true,
          label: l("scores_col_score"),
        })
      if (config.showTime)
        cells.push({
          id: "time",
          numeric: false,
          disablePadding: true,
          label: l("scores_col_time"),
        })
      if (config.showMoves)
        cells.push({
          id: "moves",
          numeric: false,
          disablePadding: true,
          label: l("scores_col_moves"),
        })
      if (config.showLevel)
        cells.push({
          id: "level",
          numeric: false,
          disablePadding: true,
          label: l("scores_col_level"),
        })
      return cells
    }, [config, l])

    return (
      <LeaderboardContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6">{l("scores_leaderboard_title")}</Typography>
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
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
              <TableHeader
                order={TableOrder.DESC}
                orderBy="score"
                headCells={headerRow}
                onRequestSort={() => {}}
              />
              <TableBody>
                {leaderboard.map((row, index) => (
                  <TableRow key={index}>
                    <LeaderboardRankCell padding="none">
                      {index + 1}
                    </LeaderboardRankCell>
                    <LeaderboardNameCell padding="none">
                      {row.user_name || row.user_address}
                    </LeaderboardNameCell>
                    {config?.showScore && (
                      <LeaderboardMetricCell padding="none">
                        {row.score}
                      </LeaderboardMetricCell>
                    )}
                    {config?.showTime && (
                      <LeaderboardMetricCell padding="none">
                        {formatMsToMinutes(row.time)}
                      </LeaderboardMetricCell>
                    )}
                    {config?.showMoves && (
                      <LeaderboardMetricCell padding="none">
                        {row.moves}
                      </LeaderboardMetricCell>
                    )}
                    {config?.showLevel && (
                      <LeaderboardMetricCell padding="none">
                        {row.level}
                      </LeaderboardMetricCell>
                    )}
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
