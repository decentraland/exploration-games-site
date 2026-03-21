import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "decentraland-ui2"
import {
  ScoresAddressTableCell,
  ScoresListContainer,
  ScoresListTableContainer,
  ScoresMetricTableCell,
  ScoresUserNameTableCell,
} from "./ScoresList.styled"
import { scoresApi } from "../../../api/scoresApi"
import { locations } from "../../../modules/Locations"
import { ProgressSort, UserProgress } from "../../../types"
import { ErrorScreen } from "../../ErrorScreen/ErrorScreen"
import { GamesList } from "../../Games/GamesList/GamesList"
import { HeadCell, TableOrder } from "../../Tables/Table.types"
import { TableHeader } from "../../Tables/TableHeader"
import { LeaderboardPreview } from "../LeaderboardPreview/LeaderboardPreview"

type UserProgressRow = UserProgress & { __rowKey: string }

const headerRow: readonly HeadCell<UserProgressRow>[] = [
  { id: "user_name", numeric: false, disablePadding: true, label: "User Name" },
  {
    id: "user_address",
    numeric: false,
    disablePadding: true,
    label: "Address",
  },
  { id: "score", numeric: true, disablePadding: true, label: "Score" },
  { id: "time", numeric: true, disablePadding: true, label: "Time" },
  { id: "moves", numeric: true, disablePadding: true, label: "Moves" },
  { id: "level", numeric: true, disablePadding: true, label: "Level" },
  { id: "disabled", numeric: false, disablePadding: true, label: "Status" },
]

const ROWS_PER_PAGE = 25

const sortToProgressSort: Partial<Record<keyof UserProgressRow, ProgressSort>> =
  {
    score: ProgressSort.SCORE,
    time: ProgressSort.TIME,
    moves: ProgressSort.MOVES,
    level: ProgressSort.LEVEL,
    user_name: ProgressSort.LATEST,
  }

const ScoresList = React.memo(() => {
  const [account, accountState] = useAuthContext()
  const loading = accountState.loading
  const l = useFormatMessage()

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [selectedGameName, setSelectedGameName] = useState<string>("")
  const [openGameSelector, setOpenGameSelector] = useState(false)

  const [scores, setScores] = useState<UserProgress[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loadingScores, setLoadingScores] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [order, setOrder] = useState<TableOrder>(TableOrder.DESC)
  const [orderBy, setOrderBy] = useState<keyof UserProgressRow>("score")
  const [page, setPage] = useState(0)

  const [selected, setSelected] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState(false)
  const [leaderboardKey, setLeaderboardKey] = useState(0)

  if (!account && !loading) {
    return <Navigate to={locations.signIn()} />
  }

  const fetchScores = useCallback(async () => {
    if (!selectedGameId) return
    setLoadingScores(true)
    setError(null)
    try {
      const sortKey = sortToProgressSort[orderBy] ?? ProgressSort.SCORE
      const direction = order === TableOrder.ASC ? "ASC" : "DESC"
      const response = await scoresApi.getAllProgressInGame(selectedGameId, {
        limit: ROWS_PER_PAGE,
        page: page + 1,
        sort: sortKey,
        direction,
      })
      setScores(response.data)
      setTotalCount(response.data.length === ROWS_PER_PAGE ? (page + 2) * ROWS_PER_PAGE : (page) * ROWS_PER_PAGE + response.data.length)
    } catch {
      setError(l("scores_error_fetch"))
    } finally {
      setLoadingScores(false)
    }
  }, [selectedGameId, order, orderBy, page, l])

  useEffect(() => {
    setSelected([])
    fetchScores()
  }, [fetchScores])

  const handleRequestSort = useCallback(
    (_: React.MouseEvent<unknown>, property: keyof UserProgressRow) => {
      const isAsc = orderBy === property && order === TableOrder.ASC
      setOrder(isAsc ? TableOrder.DESC : TableOrder.ASC)
      setOrderBy(property)
      setPage(0)
    },
    [order, orderBy]
  )

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelected(scores.map((s) => s.id))
      } else {
        setSelected([])
      }
    },
    [scores]
  )

  const handleSelectOne = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }, [])

  const handleSetStatus = useCallback(
    async (disabled: boolean) => {
      if (selected.length === 0) return
      setActionLoading(true)
      try {
        await scoresApi.setProgressStatus(selected, disabled)
        setSelected([])
        setLeaderboardKey((k) => k + 1)
        fetchScores()
      } catch {
        setError(l("scores_error_status"))
      } finally {
        setActionLoading(false)
      }
    },
    [selected, fetchScores, l]
  )

  const handleGameSelect = useCallback((gameId: string, gameName: string) => {
    setSelectedGameId(gameId)
    setSelectedGameName(gameName)
    setOpenGameSelector(false)
    setPage(0)
    setSelected([])
  }, [])

  const isSelected = (id: string) => selected.includes(id)

  return (
    <Box>
      <Toolbar>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="scoresTitle"
          component="div"
        >
          {l("scores_title")}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setOpenGameSelector(true)}
          sx={{ whiteSpace: "nowrap" }}
        >
          {selectedGameName
            ? `${l("scores_selected_game")}: ${selectedGameName}`
            : l("scores_select_game")}
        </Button>
      </Toolbar>

      {selectedGameId && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {selected.length > 0 && (
              <Toolbar sx={{ gap: 1 }}>
                <Typography variant="subtitle1" sx={{ flex: "1 1 100%" }}>
                  {selected.length} {l("scores_selected")}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  disabled={actionLoading}
                  onClick={() => handleSetStatus(true)}
                >
                  {l("scores_disable_selected")}
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  disabled={actionLoading}
                  onClick={() => handleSetStatus(false)}
                >
                  {l("scores_enable_selected")}
                </Button>
              </Toolbar>
            )}

            {loadingScores ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <ErrorScreen>
                <Alert severity="error">{error}</Alert>
              </ErrorScreen>
            ) : (
              <ScoresListContainer>
                <ScoresListTableContainer>
                  <Table aria-labelledby="scoresTitle" size="small">
                    <TableHeader
                      order={order}
                      orderBy={orderBy as string}
                      headCells={[
                        {
                          id: "__rowKey" as keyof UserProgressRow,
                          numeric: false,
                          disablePadding: true,
                          label: "",
                        },
                        ...headerRow,
                      ]}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < scores.length
                            }
                            checked={
                              scores.length > 0 &&
                              selected.length === scores.length
                            }
                            onChange={handleSelectAll}
                          />
                        </TableCell>
                        <TableCell colSpan={7} />
                      </TableRow>
                      {scores.map((row) => {
                        const isRowSelected = isSelected(row.id)
                        return (
                          <TableRow
                            hover
                            key={row.id}
                            selected={isRowSelected}
                            sx={{ cursor: "pointer" }}
                            onClick={() => handleSelectOne(row.id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isRowSelected} />
                            </TableCell>
                            <ScoresUserNameTableCell padding="none">
                              {row.user_name}
                            </ScoresUserNameTableCell>
                            <Tooltip title={row.user_address}>
                              <ScoresAddressTableCell padding="none">
                                {row.user_address}
                              </ScoresAddressTableCell>
                            </Tooltip>
                            <ScoresMetricTableCell padding="none" align="right">
                              {row.score}
                            </ScoresMetricTableCell>
                            <ScoresMetricTableCell padding="none" align="right">
                              {row.time}
                            </ScoresMetricTableCell>
                            <ScoresMetricTableCell padding="none" align="right">
                              {row.moves}
                            </ScoresMetricTableCell>
                            <ScoresMetricTableCell padding="none" align="right">
                              {row.level}
                            </ScoresMetricTableCell>
                            <TableCell padding="none">
                              {row.disabled ? (
                                <Chip
                                  label={l("scores_status_disabled")}
                                  color="error"
                                  size="small"
                                />
                              ) : (
                                <Chip
                                  label={l("scores_status_active")}
                                  color="success"
                                  size="small"
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </ScoresListTableContainer>
                <TablePagination
                  rowsPerPageOptions={[ROWS_PER_PAGE]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={ROWS_PER_PAGE}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                />
              </ScoresListContainer>
            )}
          </Box>

          <LeaderboardPreview
            gameId={selectedGameId}
            refreshKey={leaderboardKey}
          />
        </Box>
      )}

      <Dialog
        open={openGameSelector}
        onClose={() => setOpenGameSelector(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{l("scores_select_game_dialog_title")}</DialogTitle>
        <DialogContent>
          <GamesList onSelect={handleGameSelect} />
        </DialogContent>
      </Dialog>
    </Box>
  )
})

export { ScoresList }
