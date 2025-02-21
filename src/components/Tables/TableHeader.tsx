import { visuallyHidden } from "@mui/utils"
import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "decentraland-ui2"
import { TableHeaderProps, TableOrder } from "./Table.types"

const TableHeader = <D extends object>(props: TableHeaderProps<D>) => {
  const { order, orderBy, onRequestSort, headCells } = props
  const createSortHandler =
    (property: keyof D) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id.toString()}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : TableOrder.ASC}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === TableOrder.DESC
                    ? "sorted descending"
                    : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export { TableHeader }
