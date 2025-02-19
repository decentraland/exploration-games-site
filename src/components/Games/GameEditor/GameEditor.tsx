import { useCallback, useState } from "react"
import { TextField, Typography } from "decentraland-ui2"
import { gameApi } from "../../../api/gameApi"
import { GameResponse } from "../../../types"
import { SaveButton } from "../../SaveButton/SaveButton"
import { GameEditorProps } from "./GameEditor.types"
import { Container } from "./GameEditor.styled"

const EMPTY_GAME = {
  id: "",
  name: "",
  parcel: "0,0",
}

const GameEditor = ({ gameData, onUpdate }: GameEditorProps) => {
  const create = !gameData?.id
  const initData = create ? EMPTY_GAME : gameData

  const [data, setData] = useState<GameResponse>(initData)

  const saveClickHandler = useCallback(async () => {
    if (!(data.name && data.parcel)) return

    const body = {
      name: data.name,
      x: parseInt(data.parcel.split(",")[0]),
      y: parseInt(data.parcel.split(",")[1]),
    }

    if (create) {
      await gameApi.createGame(body)
    } else {
      await gameApi.updateGame(initData?.id, body)
    }

    onUpdate && onUpdate()
  }, [create, initData?.id, data.name, data.parcel, onUpdate])

  if (!initData) return null

  const nameChanged = data.name !== initData.name
  const parcelXChanged =
    data.parcel?.split(",")[0] !== initData.parcel?.split(",")[0]
  const parcelYChanged =
    data.parcel?.split(",")[1] !== initData.parcel?.split(",")[1]

  const dataChanged = nameChanged || parcelXChanged || parcelYChanged

  return (
    <Container>
      {!create && <Typography> Game ID: {initData.id}</Typography>}
      <TextField
        label="Name"
        variant="standard"
        value={data.name}
        focused={nameChanged}
        color={nameChanged ? "warning" : "success"}
        onChange={(e) => setData((data) => ({ ...data, name: e.target.value }))}
      />
      <TextField
        label="Parcel X:"
        variant="standard"
        type="number"
        color={parcelXChanged ? "warning" : "success"}
        focused={parcelXChanged}
        value={data.parcel?.split(",")[0]}
        onChange={(e) =>
          setData((data) => ({
            ...data,
            parcel: `${e.target.value},${data.parcel?.split(",")[1]}`,
          }))
        }
        error={isNaN(Number(data.parcel?.split(",")[0]))}
        helperText={!data.parcel?.split(",")[0] ? "Parcel X is required" : ""}
      />
      <TextField
        label="Parcel Y:"
        variant="standard"
        type="number"
        color={parcelYChanged ? "warning" : "success"}
        focused={parcelYChanged}
        value={data.parcel?.split(",")[1]}
        onChange={(e) =>
          setData((data) => ({
            ...data,
            parcel: `${data.parcel?.split(",")[0]},${e.target.value}`,
          }))
        }
        error={isNaN(Number(data.parcel?.split(",")[1]))}
        helperText={!data.parcel?.split(",")[1] ? "Parcel Y is required" : ""}
      />
      <SaveButton disabled={!dataChanged} onClick={saveClickHandler} />
    </Container>
  )
}

export { GameEditor }
