enum TableOrder {
  ASC = "asc",
  DESC = "desc",
}

type HeadCell<D> = {
  disablePadding: boolean
  id: keyof D
  label: string
  numeric: boolean
}

type TableHeaderProps<D> = {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof D) => void
  order: TableOrder
  orderBy: string
  headCells: readonly HeadCell<D>[]
}

export { TableOrder }
export type { HeadCell, TableHeaderProps }
