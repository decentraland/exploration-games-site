import * as React from "react"
import { Navigate } from "react-router-dom"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "decentraland-ui2"
import { GameEditor } from "./GameEditor.tsx"
import { locations } from "../../modules/Locations.ts"
import { gameService } from "../../services/gameService.ts"
import { GameResponse } from "../../types.ts"
import { HeadCell, TableOrder } from "../Tables/Table.types.ts"
import { TableHeader } from "../Tables/TableHeader.tsx"
import { getComparator, stableSort } from "../Tables/utils.ts"

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

const GameList = ({ onSelect }: { onSelect?: (gameId: string) => void }) => {
  const [account, accountState] = useAuthContext()
  const loading = accountState.loading
  const [games, setGames] = React.useState<GameResponse[]>([])
  const [selectedGame, setSelectedGame] = React.useState<GameResponse | null>(
    null
  )
  const [openEditor, setOpenEditor] = React.useState(false)
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
      const data = await gameService.getAllGames()
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
      onSelect(game.id)
    } else {
      setSelectedGame(game)
      setOpenEditor(true)
    }
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
    <Box sx={{ width: "100%" }}>
      <TableContainer sx={{ paddingX: 2 }}>
        <Table
          // sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
        >
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
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                    sx={{ minWidth: "300px" }}
                  >
                    {row.id}
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                    sx={{ minWidth: "100px" }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                    sx={{ minWidth: "50px" }}
                  >
                    {row.parcel}
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
      </TableContainer>
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
        onClose={() => setOpenEditor(false)}
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
    </Box>
  )
}

export { GameList }
