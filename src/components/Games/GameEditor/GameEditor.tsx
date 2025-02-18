import { useCallback, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { TextField, Typography } from "decentraland-ui2"
import { gameApi } from "../../../api/gameApi"
import { GameEditorProps } from "./GameEditor.types"
import { Container, SaveButton } from "./GameEditor.styled"

const EMPTY_GAME = {
  id: "",
  name: "",
  parcel: "0,0",
}

const GameEditor = ({ gameData, onUpdate }: GameEditorProps) => {
  const create = !gameData?.id
  const initData = create ? EMPTY_GAME : gameData

  const [name, setName] = useState(initData?.name || "")
  const [parcelX, setParcelX] = useState(
    parseInt(initData?.parcel?.split(",")[0] || "0")
  )
  const [parcelY, setParcelY] = useState(
    parseInt(initData?.parcel?.split(",")[1] || "0")
  )

  const l = useFormatMessage()
  const saveClickHandler = useCallback(async () => {
    if (!(name && parcelX && parcelY)) return

    const body = {
      name,
      x: parcelX,
      y: parcelY,
    }

    if (create) {
      await gameApi.createGame(body)
    } else {
      await gameApi.updateGame(initData?.id, body)
    }

    onUpdate && onUpdate()
  }, [create, initData?.id, name, parcelX, parcelY, onUpdate])

  if (!initData) return null

  const dataChanged =
    name !== initData.name ||
    parcelX !== parseInt(initData.parcel?.split(",")[0] || "0") ||
    parcelY !== parseInt(initData.parcel?.split(",")[1] || "0")

  return (
    <Container>
      {!create && <Typography> Game ID: {initData.id}</Typography>}
      <TextField
        label="Name"
        variant="standard"
        value={name}
        focused={name !== initData.name}
        color={name !== initData.name ? "warning" : "success"}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Parcel X:"
        variant="standard"
        type="number"
        color={
          parcelX.toString() !== initData.parcel?.split(",")[0]
            ? "warning"
            : "success"
        }
        focused={parcelX.toString() !== initData.parcel?.split(",")[0]}
        value={parcelX}
        onChange={(e) => setParcelX(parseInt(e.target.value))}
        error={isNaN(parcelX)}
        helperText={!parcelX ? "Parcel X is required" : ""}
      />
      <TextField
        label="Parcel Y:"
        variant="standard"
        type="number"
        color={
          parcelY.toString() !== initData.parcel?.split(",")[1]
            ? "warning"
            : "success"
        }
        focused={parcelY.toString() !== initData.parcel?.split(",")[1]}
        value={parcelY}
        onChange={(e) => setParcelY(parseInt(e.target.value))}
        error={isNaN(parcelY)}
        helperText={!parcelY ? "Parcel Y is required" : ""}
      />
      <SaveButton
        variant="contained"
        disabled={!dataChanged}
        onClick={saveClickHandler}
      >
        {l("save_changes")}
      </SaveButton>
    </Container>
  )
}

export { GameEditor }
