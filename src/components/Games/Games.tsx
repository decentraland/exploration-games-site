import * as React from "react"
import { Navigate } from "react-router-dom"
import Box from "@mui/material/Box"
import FormControlLabel from "@mui/material/FormControlLabel"
import Paper from "@mui/material/Paper"
import Switch from "@mui/material/Switch"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import { CircularProgress } from "decentraland-ui2"
import { locations } from "../../modules/Locations.ts"
import { gameService } from "../../services/gameService.ts"
import { Game } from "../../types.ts"
import { HeadCell, TableOrder } from "../Tables/Table.types.ts"
import { TableHeader } from "../Tables/TableHeader.tsx"
import { getComparator, stableSort } from "../Tables/utils.ts"

const headerExample: readonly HeadCell<Game>[] = [
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

function GameListToolbar() {
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Games
      </Typography>
    </Toolbar>
  )
}
const Games = () => {
  const [account, accountState] = useAuthContext()
  const loading = accountState.loading
  const [games, setGames] = React.useState<Game[]>([])
  const [loadingGames, setLoadingGames] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  if (!account && !loading) {
    return <Navigate to={locations.signIn()} />
  }
  const [order, setOrder] = React.useState<TableOrder>(TableOrder.ASC)
  const [orderBy, setOrderBy] = React.useState<keyof Game>("name")
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)

  React.useEffect(() => {
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

    fetchGames()
  }, [])

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof Game
  ) => {
    const isAsc = orderBy === property && order === TableOrder.ASC
    setOrder(isAsc ? TableOrder.DESC : TableOrder.ASC)
    setOrderBy(property)
  }

  const handleClick = (_: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
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

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1

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
      <Paper sx={{ width: "100%", mb: 2 }}>
        <GameListToolbar />
        <TableContainer sx={{ paddingX: 2 }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <TableHeader
              order={order}
              orderBy={orderBy}
              headCells={headerExample}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(index)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, index)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={index}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.parcel}
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
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
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  )
}

export { Games }
