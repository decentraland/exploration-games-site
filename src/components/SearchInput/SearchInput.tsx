import * as React from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { TextField } from "decentraland-ui2"
import { SearchInputProps } from "./SearchInput.typed"

const SearchInput = React.memo(({ value, onChange }: SearchInputProps) => {
  const l = useFormatMessage()
  return (
    <TextField
      label={l("search")}
      size="small"
      value={value}
      onChange={onChange}
    />
  )
})

export { SearchInput }
