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
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from "decentraland-ui2"
import { MissionEditor } from "./MissionEditor"
import { locations } from "../../modules/Locations"
import { missionService } from "../../services/missionService"
import { Mission } from "../../types"
import { HeadCell, TableOrder } from "../Tables/Table.types"
import { TableHeader } from "../Tables/TableHeader"
import { getComparator, stableSort } from "../Tables/utils"

const headerData: readonly HeadCell<Mission>[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: true,
    label: "Description",
  },
  {
    id: "campaign_key",
    numeric: false,
    disablePadding: true,
    label: "Campaign Key",
  },
]

function MissionListToolbar() {
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Missions
      </Typography>
    </Toolbar>
  )
}

const MissionList = () => {
  const [account, accountState] = useAuthContext()
  const loading = accountState.loading
  const [missions, setMissions] = React.useState<Mission[]>([])
  const [loadingMissions, setLoadingMissions] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  if (!account && !loading) {
    return <Navigate to={locations.signIn()} />
  }
  const [order, setOrder] = React.useState<TableOrder>(TableOrder.ASC)
  const [orderBy, setOrderBy] = React.useState<keyof Mission>("description")
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)
  const [openModal, setOpenModal] = React.useState(false)
  const [selectedMissionId, setSelectedMissionId] = React.useState<
    string | null
  >(null)

  React.useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoadingMissions(true)
        const data = await missionService.getAllMissions()
        setMissions(data)
      } catch (err) {
        setError("Failed to fetch missions")
      } finally {
        setLoadingMissions(false)
      }
    }

    fetchMissions()
  }, [])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Mission
  ) => {
    const isAsc = orderBy === property && order === TableOrder.ASC
    setOrder(isAsc ? TableOrder.DESC : TableOrder.ASC)
    setOrderBy(property)
  }

  const handleClickInfoModal = (
    event: React.MouseEvent<unknown>,
    missionId: string
  ) => {
    console.log("open mod al", missionId)
    setSelectedMissionId(missionId)
    setOpenModal(true)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - missions.length) : 0

  const visibleRows = React.useMemo(
    () =>
      stableSort(missions, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, missions]
  )

  if (loadingMissions) {
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

  if (missions.length === 0) {
    return <div>No missions found</div>
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ mb: 2 }}>
        <MissionListToolbar />
        <TableContainer sx={{ paddingX: 2 }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <TableHeader
              order={order}
              orderBy={orderBy}
              headCells={headerData}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClickInfoModal(event, row.id)}
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
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
                      {row.description}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {/* TODO: Add campaign key to server endpoint */}
                      {row.campaign_key}
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
          count={missions.length || 0}
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Mission Info</DialogTitle>
        <DialogContent>
          <MissionEditor missionId={selectedMissionId} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export { MissionList }
