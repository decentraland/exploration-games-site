import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import { Add } from "@mui/icons-material"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "decentraland-ui2"
import { missionApi } from "../../../api/missionApi"
import { locations } from "../../../modules/Locations"
import { MissionRequest } from "../../../types"
import { HeadCell, TableOrder } from "../../Tables/Table.types"
import { TableHeader } from "../../Tables/TableHeader"
import { getComparator, stableSort } from "../../Tables/utils"
import { MissionEditor } from "../MissionEditor/MissionEditor"
import { Container, MissionsTable, TableContainer } from "./MissionList.styled"

const headerData: readonly HeadCell<MissionRequest>[] = [
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

const MissionList = React.memo(
  ({
    onSelect,
  }: {
    onSelect?: (missionId: string, missionName: string) => void
  }) => {
    const [account, accountState] = useAuthContext()
    const loading = accountState.loading
    const [missions, setMissions] = useState<MissionRequest[]>([])
    const [loadingMissions, setLoadingMissions] = useState(true)
    const [error, setError] = useState<string | null>(null)

    if (!account && !loading) {
      return <Navigate to={locations.signIn()} />
    }
    const [order, setOrder] = useState<TableOrder>(TableOrder.ASC)
    const [orderBy, setOrderBy] = useState<keyof MissionRequest>("description")
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25)
    const [openModal, setOpenModal] = useState(false)
    const [selectedMissionId, setSelectedMissionId] = useState<string | null>(
      null
    )

    useEffect(() => {
      fetchMissions()
    }, [])

    const fetchMissions = async () => {
      try {
        setLoadingMissions(true)
        const data = await missionApi.getAllMissions()
        setMissions(data)
      } catch (err) {
        setError("Failed to fetch missions")
      } finally {
        setLoadingMissions(false)
      }
    }

    const handleRequestSort = useCallback(
      (_: React.MouseEvent<unknown>, property: keyof MissionRequest) => {
        const isAsc = orderBy === property && order === TableOrder.ASC
        setOrder(isAsc ? TableOrder.DESC : TableOrder.ASC)
        setOrderBy(property)
      },
      [order, orderBy]
    )

    const handleClickInfoModal = useCallback(
      (missionId: string, missionDescription: string) => {
        if (onSelect) {
          onSelect(missionId, missionDescription)
        } else {
          console.log("open modal", missionId)
          setSelectedMissionId(missionId)
          setOpenModal(true)
        }
      },
      [onSelect]
    )

    const handleChangePage = useCallback((_: unknown, newPage: number) => {
      setPage(newPage)
    }, [])

    const handleChangeRowsPerPage = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
      },
      []
    )

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - missions.length) : 0

    const visibleRows = useMemo(
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
      <Container>
        <Toolbar>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Missions
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add fontSize="small" />}
            onClick={() => {
              setSelectedMissionId(null)
              setOpenModal(true)
            }}
          >
            mission
          </Button>
        </Toolbar>
        <TableContainer>
          <MissionsTable>
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
                    onClick={() =>
                      handleClickInfoModal(row.id || "", row.description || "")
                    }
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
                      {row.campaign_key}
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
          </MissionsTable>
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
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Mission Info</DialogTitle>
          <DialogContent>
            <MissionEditor
              missionId={selectedMissionId || ""}
              onUpdate={() => {
                fetchMissions()
                !selectedMissionId && setOpenModal(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </Container>
    )
  }
)

export { MissionList }
