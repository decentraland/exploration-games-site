import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { Edit } from "@mui/icons-material"
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "decentraland-ui2"
import {
  GameIdTableCell,
  GameListContainer,
  GameListTableContainer,
  GameNameTableCell,
  GameParcelTableCell,
} from "./GamesList.styled.ts"
import { GamesProps } from "./GamesList.typed.ts"
import { gameApi } from "../../../api/gameApi.ts"
import { locations } from "../../../modules/Locations.ts"
import { GameResponse } from "../../../types.ts"
import { AddButton } from "../../AddButton/AddButton.tsx"
import { SearchInput } from "../../SearchInput/SearchInput.tsx"
import { HeadCell, TableOrder } from "../../Tables/Table.types.ts"
import { TableHeader } from "../../Tables/TableHeader.tsx"
import { getComparator, stableSort } from "../../Tables/utils.ts"
import { GameEditor } from "../GameEditor/GameEditor.tsx"

const headerRow: readonly HeadCell<GameResponse>[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "parcel",
    numeric: false,
    disablePadding: true,
    label: "Parcel",
  },
]

const GamesList = React.memo(({ onSelect }: GamesProps) => {
  const [account, accountState] = useAuthContext()
  const loading = accountState.loading
  const [games, setGames] = useState<GameResponse[]>([])
  const [selectedGame, setSelectedGame] = useState<GameResponse | null>(null)
  const [openEditor, setOpenEditor] = useState(false)
  const [loadingGames, setLoadingGames] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const l = useFormatMessage()

  if (!account && !loading) {
    return <Navigate to={locations.signIn()} />
  }
  const [order, setOrder] = useState<TableOrder>(TableOrder.ASC)
  const [orderBy, setOrderBy] = useState<keyof GameResponse>("name")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [search, setSearch] = useState("")

  const fetchGames = useCallback(async () => {
    try {
      const data = await gameApi.getAllGames()
      setGames(data)
    } catch (err) {
      setError("Failed to fetch games")
    } finally {
      setLoadingGames(false)
    }
  }, [])

  useEffect(() => {
    fetchGames()
  }, [])

  const handleRequestSort = useCallback(
    (_: React.MouseEvent<unknown>, property: keyof GameResponse) => {
      const isAsc = orderBy === property && order === TableOrder.ASC
      setOrder(isAsc ? TableOrder.DESC : TableOrder.ASC)
      setOrderBy(property)
    },
    [order, orderBy]
  )

  const openEditorHandler = useCallback((game: GameResponse) => {
    setSelectedGame(game)
    setOpenEditor(true)
  }, [])

  const handleClick = useCallback(
    (game: GameResponse) => {
      if (onSelect) {
        onSelect(game.id, game.name)
      } else {
        openEditorHandler(game)
      }
    },
    [onSelect, openEditorHandler]
  )

  const handleChangePage = useCallback(
    (
      _: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
      newPage: number
    ) => {
      setPage(newPage)
    },
    []
  )

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    },
    []
  )

  const filteredGames = useMemo(() => {
    return games.filter((game) =>
      JSON.stringify(game).toLowerCase().includes(search.toLowerCase())
    )
  }, [games, search])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = useMemo(
    () => (page > 0 ? Math.max(0, (1 + page) * rowsPerPage - games.length) : 0),
    [page, rowsPerPage, games]
  )

  const visibleRows = useMemo(
    () =>
      stableSort(filteredGames, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredGames]
  )

  if (loadingGames) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <div>{error}</div>
  }

  if (games.length === 0) {
    return <div>No games found</div>
  }

  return (
    <Box>
      <Toolbar>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {l("game_list.games")}
        </Typography>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton
          onClick={() => {
            setSelectedGame(null)
            setOpenEditor(true)
          }}
        >
          {l("game_list.game")}
        </AddButton>
      </Toolbar>
      <GameListContainer>
        <GameListTableContainer>
          <Table aria-labelledby="tableTitle">
            <TableHeader
              order={order}
              orderBy={orderBy}
              headCells={headerRow}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(row)}
                    key={index}
                    sx={{ cursor: "pointer" }}
                  >
                    <GameIdTableCell padding="none">{row.id}</GameIdTableCell>
                    <GameNameTableCell padding="none">
                      {row.name}
                    </GameNameTableCell>
                    <GameParcelTableCell padding="none">
                      {row.parcel}
                    </GameParcelTableCell>
                    <TableCell padding="none">
                      {onSelect && (
                        <IconButton
                          aria-label="edit"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditorHandler(row)
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 21 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} padding="none" />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </GameListTableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={games.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog
          open={openEditor}
          onClose={() => {
            setOpenEditor(false)
          }}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>{l("game_list.dialog_title")}</DialogTitle>
          <DialogContent>
            <GameEditor
              gameData={selectedGame}
              onUpdate={() => {
                setOpenEditor(false)
                fetchGames()
              }}
            />
          </DialogContent>
        </Dialog>
      </GameListContainer>
    </Box>
  )
})

export { GamesList }
