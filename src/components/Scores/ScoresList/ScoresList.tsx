import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { List as ListIcon } from "@mui/icons-material"
import {
  Address,
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
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
  ScoresStatusTableCell,
  ScoresUserNameTableCell,
} from "./ScoresList.styled.ts"
import { scoresApi } from "../../../api/scoresApi.ts"
import { leaderboardConfig } from "../../../config/leaderboard.ts"
import { locations } from "../../../modules/Locations.ts"
import { ProgressSort, UserProgress } from "../../../types.ts"
import { formatMsToMinutes } from "../../../utils/formatTime.ts"
import { ErrorScreen } from "../../ErrorScreen/ErrorScreen.tsx"
import { GamesList } from "../../Games/GamesList/GamesList.tsx"
import { SearchInput } from "../../SearchInput/SearchInput.tsx"
import { HeadCell, TableOrder } from "../../Tables/Table.types.ts"
import { TableHeader } from "../../Tables/TableHeader.tsx"
import { LeaderboardPreview } from "../LeaderboardPreview/LeaderboardPreview.tsx"

type UserProgressRow = UserProgress & { __rowKey: string }

const sortToProgressSort: Partial<Record<keyof UserProgressRow, ProgressSort>> =
  {
    score: ProgressSort.SCORE,
    time: ProgressSort.TIME,
    moves: ProgressSort.MOVES,
    level: ProgressSort.LEVEL,
    user_name: ProgressSort.LATEST,
  }

// Module-level state persists across route navigation (component unmount/remount)
let _gameId: string | null = null
let _gameName = ""
let _gameParcel = ""

const FETCH_LIMIT = 1000

const ScoresList = React.memo(() => {
  const [account, accountState] = useAuthContext()
  const loading = accountState.loading
  const l = useFormatMessage()

  const [selectedGameId, setSelectedGameId] = useState<string | null>(_gameId)
  const [selectedGameName, setSelectedGameName] = useState<string>(_gameName)
  const [selectedGameParcel, setSelectedGameParcel] =
    useState<string>(_gameParcel)
  const [openGameSelector, setOpenGameSelector] = useState(false)

  const [allScores, setAllScores] = useState<UserProgress[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [nextApiBatchPage, setNextApiBatchPage] = useState(2)
  const [loadingScores, setLoadingScores] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [order, setOrder] = useState<TableOrder>(TableOrder.DESC)
  const [orderBy, setOrderBy] = useState<keyof UserProgressRow>("score")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [search, setSearch] = useState("")

  const [selected, setSelected] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState(false)
  const [leaderboardKey, setLeaderboardKey] = useState(0)
  const [showLeaderboard, setShowLeaderboard] = useState(true)

  const headerRow = useMemo<readonly HeadCell<UserProgressRow>[]>(
    () => [
      {
        id: "user_name",
        numeric: false,
        disablePadding: true,
        label: l("scores_col_user_name"),
      },
      {
        id: "user_address",
        numeric: false,
        disablePadding: true,
        label: l("scores_col_user_address"),
      },
      {
        id: "score",
        numeric: false,
        disablePadding: true,
        label: l("scores_col_score"),
      },
      {
        id: "time",
        numeric: false,
        disablePadding: true,
        label: l("scores_col_time"),
      },
      {
        id: "moves",
        numeric: false,
        disablePadding: true,
        label: l("scores_col_moves"),
      },
      {
        id: "level",
        numeric: false,
        disablePadding: true,
        label: l("scores_col_level"),
      },
      {
        id: "disabled",
        numeric: false,
        disablePadding: true,
        label: l("scores_col_status"),
      },
    ],
    [l]
  )

  const fetchScores = useCallback(async () => {
    if (!selectedGameId) return
    setLoadingScores(true)
    setError(null)
    try {
      const sortKey = sortToProgressSort[orderBy] ?? ProgressSort.SCORE
      const direction = order === TableOrder.ASC ? "ASC" : "DESC"
      const response = await scoresApi.getAllProgressInGame(selectedGameId, {
        limit: FETCH_LIMIT,
        page: 1,
        sort: sortKey,
        direction,
      })
      setAllScores(response.data)
      setHasMore(response.data.length === FETCH_LIMIT)
      setNextApiBatchPage(2)
    } catch {
      setError(l("scores_error_fetch"))
    } finally {
      setLoadingScores(false)
    }
  }, [selectedGameId, order, orderBy, l])

  const fetchMoreScores = useCallback(async () => {
    if (!selectedGameId) return
    setLoadingMore(true)
    try {
      const sortKey = sortToProgressSort[orderBy] ?? ProgressSort.SCORE
      const direction = order === TableOrder.ASC ? "ASC" : "DESC"
      const response = await scoresApi.getAllProgressInGame(selectedGameId, {
        limit: FETCH_LIMIT,
        page: nextApiBatchPage,
        sort: sortKey,
        direction,
      })
      setAllScores((prev) => [...prev, ...response.data])
      setHasMore(response.data.length === FETCH_LIMIT)
      setNextApiBatchPage((prev) => prev + 1)
    } catch {
      setError(l("scores_error_fetch"))
    } finally {
      setLoadingMore(false)
    }
  }, [selectedGameId, nextApiBatchPage, order, orderBy, l])

  useEffect(() => {
    setSelected([])
    fetchScores()
  }, [fetchScores])

  // Fetch more when user reaches the last available display page
  useEffect(() => {
    if (!hasMore || search || loadingMore || loadingScores) return
    const lastDisplayedIndex = (page + 1) * rowsPerPage
    if (lastDisplayedIndex >= allScores.length) {
      fetchMoreScores()
    }
  }, [
    page,
    rowsPerPage,
    hasMore,
    allScores.length,
    search,
    loadingMore,
    loadingScores,
    fetchMoreScores,
  ])

  const filteredScores = useMemo(() => {
    if (!search) return allScores
    return allScores.filter((row) =>
      JSON.stringify(Object.values(row))
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [allScores, search])

  const pagedScores = useMemo(
    () => filteredScores.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [filteredScores, page, rowsPerPage]
  )

  const paginationCount = useMemo(() => {
    if (hasMore) return -1
    if (search) return filteredScores.length
    return allScores.length
  }, [hasMore, search, filteredScores.length, allScores.length])

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
        setSelected(filteredScores.map((s) => s.id))
      } else {
        setSelected([])
      }
    },
    [filteredScores]
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

  const handleGameSelect = useCallback(
    (gameId: string, gameName: string, gameParcel: string) => {
      _gameId = gameId
      _gameName = gameName
      _gameParcel = gameParcel
      setSelectedGameId(gameId)
      setSelectedGameName(gameName)
      setSelectedGameParcel(gameParcel)
      setOpenGameSelector(false)
      setPage(0)
      setSelected([])
      if (gameId in leaderboardConfig) setShowLeaderboard(true)
    },
    []
  )

  if (!account && !loading) {
    return <Navigate to={locations.signIn()} />
  }

  const isSelected = (id: string) => selected.includes(id)
  const hasLeaderboard = !!selectedGameId && selectedGameId in leaderboardConfig

  return (
    <Box>
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="scoresTitle"
          component="div"
        >
          {l("scores_title")}
        </Typography>

        {selected.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
              {selected.length} {l("scores_selected")}
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              disabled={actionLoading}
              onClick={() => handleSetStatus(true)}
              sx={{ whiteSpace: "nowrap", fontSize: "0.7rem" }}
            >
              {l("scores_disable_selected")}
            </Button>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={actionLoading}
              onClick={() => handleSetStatus(false)}
              sx={{ whiteSpace: "nowrap", fontSize: "0.7rem" }}
            >
              {l("scores_enable_selected")}
            </Button>
          </>
        )}

        {selectedGameId && (
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        {hasLeaderboard && (
          <Tooltip title="Show Leaderboard">
            <Button
              // size="small"
              variant={!showLeaderboard ? "outlined" : "contained"}
              onClick={() => setShowLeaderboard((v) => !v)}
            >
              <ListIcon fontSize="small" />
            </Button>
          </Tooltip>
        )}
        <Divider orientation="vertical" />
        <Button
          variant="contained"
          size="small"
          onClick={() => setOpenGameSelector(true)}
          sx={
            selectedGameName
              ? {
                  // Prevent the button from being squeezed by the toolbar,
                  // which would force the game name/id to wrap.
                  whiteSpace: "nowrap",
                  textAlign: "left",
                  lineHeight: 1.3,
                  minWidth: "max-content",
                  flexShrink: 0,
                }
              : { whiteSpace: "nowrap" }
          }
        >
          {selectedGameName ? (
            <Box
              component="span"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>
                {selectedGameName} ({selectedGameParcel})
              </span>
              <span
                style={{
                  fontSize: "0.6rem",
                  opacity: 0.8,
                  whiteSpace: "nowrap",
                }}
              >
                {selectedGameId}
              </span>
            </Box>
          ) : (
            <Box component="span" padding={0.5}>
              {l("scores_select_game")}
            </Box>
          )}
        </Button>
      </Toolbar>

      {selectedGameId && (
        <>
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
                <Table
                  aria-labelledby="scoresTitle"
                  size="small"
                  sx={{ minWidth: "700px" }}
                >
                  <TableHeader
                    order={order}
                    orderBy={orderBy as string}
                    headCells={headerRow}
                    onRequestSort={handleRequestSort}
                    checkboxCell={
                      <Checkbox
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < filteredScores.length
                        }
                        checked={
                          filteredScores.length > 0 &&
                          selected.length === filteredScores.length
                        }
                        onChange={handleSelectAll}
                      />
                    }
                  />
                  <TableBody>
                    {pagedScores.map((row) => {
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
                          <ScoresAddressTableCell padding="none">
                            <Address tooltip value={row.user_address} />
                          </ScoresAddressTableCell>
                          <ScoresMetricTableCell padding="none">
                            {row.score}
                          </ScoresMetricTableCell>
                          <ScoresMetricTableCell padding="none">
                            {formatMsToMinutes(row.time)}
                          </ScoresMetricTableCell>
                          <ScoresMetricTableCell padding="none">
                            {row.moves}
                          </ScoresMetricTableCell>
                          <ScoresMetricTableCell padding="none">
                            {row.level}
                          </ScoresMetricTableCell>
                          <ScoresStatusTableCell padding="none">
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: row.disabled
                                  ? "error.main"
                                  : "success.main",
                              }}
                            />
                          </ScoresStatusTableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScoresListTableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={paginationCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10))
                  setPage(0)
                }}
              />
              {loadingMore && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </ScoresListContainer>
          )}

          {hasLeaderboard && showLeaderboard && (
            <LeaderboardPreview
              gameId={selectedGameId}
              refreshKey={leaderboardKey}
              onClose={() => setShowLeaderboard(false)}
            />
          )}
        </>
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
