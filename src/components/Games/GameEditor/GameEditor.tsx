import * as React from "react"
import { useCallback, useMemo, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { Typography } from "decentraland-ui2"
import { gameApi } from "../../../api/gameApi"
import { GameRequest } from "../../../types"
import { SaveButton } from "../../SaveButton/SaveButton"
import { TextFieldStyled } from "../../TextFieldStyled/TextFieldStyled"
import { GameEditorProps } from "./GameEditor.types"
import { Container } from "./GameEditor.styled"

const EMPTY_GAME = {
  id: "",
  name: "",
  x: 0,
  y: 0,
}

const GameEditor = React.memo(({ gameData, onUpdate }: GameEditorProps) => {
  const create = !gameData?.id
  const initData = create
    ? EMPTY_GAME
    : {
        ...gameData,
        x: parseInt(gameData.parcel.split(",")[0]),
        y: parseInt(gameData.parcel.split(",")[1]),
      }

  const [data, setData] = useState<GameRequest>(initData)

  const l = useFormatMessage()

  const saveClickHandler = useCallback(async () => {
    if (!(data.name && data.x && data.y)) return

    if (create) {
      await gameApi.createGame(data)
    } else {
      await gameApi.updateGame(initData?.id, data)
    }

    onUpdate && onUpdate()
  }, [create, initData?.id, data.name, data.x, data.y, onUpdate])

  const nameChanged = useMemo(
    () => data.name !== initData.name,
    [data.name, initData.name]
  )
  const parcelXChanged = useMemo(
    () => data.x !== initData.x,
    [data.x, initData.x]
  )
  const parcelYChanged = useMemo(
    () => data.y !== initData.y,
    [data.y, initData.y]
  )

  const dataChanged = useMemo(
    () => nameChanged || parcelXChanged || parcelYChanged,
    [nameChanged, parcelXChanged, parcelYChanged]
  )

  return (
    <Container>
      {!create && (
        <Typography>
          {l("game_editor.id")}: {initData.id}
        </Typography>
      )}
      <TextFieldStyled
        label={l("game_editor.name")}
        value={data.name}
        focused={nameChanged}
        onChange={(e) => setData((data) => ({ ...data, name: e.target.value }))}
      />
      <TextFieldStyled
        label={l("game_editor.parcel_x")}
        type="number"
        focused={parcelXChanged}
        value={data.x}
        onChange={(e) =>
          setData((data) => ({
            ...data,
            x: Number(e.target.value),
          }))
        }
        error={isNaN(Number(data.x))}
        helperText={!data.x ? l("game_editor.parcel_x_required") : ""}
      />
      <TextFieldStyled
        label={l("game_editor.parcel_y")}
        type="number"
        focused={parcelYChanged}
        value={data.y}
        onChange={(e) =>
          setData((data) => ({
            ...data,
            y: Number(e.target.value),
          }))
        }
        error={isNaN(Number(data.y))}
        helperText={!data.y ? l("game_editor.parcel_y_required") : ""}
      />
      <SaveButton disabled={!dataChanged} onClick={saveClickHandler} />
    </Container>
  )
})

export { GameEditor }
