import * as React from "react"
import { Navigate } from "react-router-dom"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import { Add, Edit } from "@mui/icons-material"
import {
  Box,
  Button,
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
} from "./Games.styled.ts"
import { gameApi } from "../../../api/gameApi.ts"
import { locations } from "../../../modules/Locations.ts"
import { GameResponse } from "../../../types.ts"
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

const Games = ({
  onSelect,
}: {
  onSelect?: (gameId: string, gameName: string) => void
}) => {
  const [account, accountState] = useAuthContext()
  const loading = accountState.loading
  const [games, setGames] = React.useState<GameResponse[]>([])
  const [selectedGame, setSelectedGame] = React.useState<GameResponse | null>(
    null
  )
  const [openEditor, setOpenEditor] = React.useState(false)
  // const [openCreator, setOpenCreator] = React.useState(false)
  const [loadingGames, setLoadingGames] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  if (!account && !loading) {
    return <Navigate to={locations.signIn()} />
  }
  const [order, setOrder] = React.useState<TableOrder>(TableOrder.ASC)
  const [orderBy, setOrderBy] = React.useState<keyof GameResponse>("name")
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)

  const fetchGames = async () => {
    try {
      const data = await gameApi.getAllGames()
      setGames(data)
    } catch (err) {
      setError("Failed to fetch games")
    } finally {
      setLoadingGames(false)
    }
  }

  React.useEffect(() => {
    fetchGames()
  }, [])

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof GameResponse
  ) => {
    const isAsc = orderBy === property && order === TableOrder.ASC
    setOrder(isAsc ? TableOrder.DESC : TableOrder.ASC)
    setOrderBy(property)
  }

  const handleClick = (game: GameResponse) => {
    if (onSelect) {
      onSelect(game.id, game.name)
    } else {
      openEditorHandler(game)
    }
  }

  const openEditorHandler = (game: GameResponse) => {
    setSelectedGame(game)
    setOpenEditor(true)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - games.length) : 0

  const visibleRows = React.useMemo(
    () =>
      stableSort(games, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, games]
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
          Games
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add fontSize="small" />}
          onClick={() => {
            setSelectedGame(null)
            setOpenEditor(true)
          }}
        >
          game
        </Button>
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
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(row)}
                    key={index}
                    sx={{ cursor: "pointer" }}
                  >
                    <GameIdTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </GameIdTableCell>
                    <GameNameTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </GameNameTableCell>
                    <GameParcelTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.parcel}
                    </GameParcelTableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
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
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
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
          <DialogTitle>Game</DialogTitle>
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
}

export { Games }
