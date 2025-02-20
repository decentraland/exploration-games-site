import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { Typography } from "decentraland-ui2"
import { gameApi } from "../../../api/gameApi"
import { GameRequest } from "../../../types"
import { compareDataChanged } from "../../../utils/compareDataChanged"
import { SaveButton } from "../../SaveButton/SaveButton"
import { TextFieldStyled } from "../../TextFieldStyled/TextFieldStyled"
import { GameEditorProps } from "./GameEditor.types"
import { Container } from "./GameEditor.styled"

const EMPTY_GAME = {
  name: "",
  x: 0,
  y: 0,
}

const GameEditor = React.memo(({ gameData, onUpdate }: GameEditorProps) => {
  const create = !gameData?.id
  const initData: GameRequest = create
    ? EMPTY_GAME
    : {
        name: gameData.name,
        x: parseInt(gameData.parcel.split(",")[0]),
        y: parseInt(gameData.parcel.split(",")[1]),
      }

  const [data, setData] = useState<GameRequest>(initData)
  const [dataChanged, setDataChanged] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setDataChanged(compareDataChanged(initData, data))
  }, [initData, data])

  const l = useFormatMessage()

  const saveClickHandler = useCallback(async () => {
    if (!(data.name && data.x && data.y)) return

    if (create) {
      await gameApi.createGame(data)
    } else {
      await gameApi.updateGame(gameData.id, data)
    }

    onUpdate && onUpdate()
  }, [create, gameData?.id, data.name, data.x, data.y, onUpdate])

  const hasNewChanges = useMemo(() => {
    return Object.values(dataChanged).some((value) => value)
  }, [dataChanged])

  return (
    <Container>
      {!create && (
        <Typography>
          {l("game_editor.id")}: {gameData?.id}
        </Typography>
      )}
      <TextFieldStyled
        label={l("game_editor.name")}
        value={data.name}
        focused={dataChanged["name"]}
        onChange={(e) => setData((data) => ({ ...data, name: e.target.value }))}
      />
      <TextFieldStyled
        label={l("game_editor.parcel_x")}
        type="number"
        focused={dataChanged["x"]}
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
        focused={dataChanged["y"]}
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
      <SaveButton disabled={!hasNewChanges} onClick={saveClickHandler} />
    </Container>
  )
})

export { GameEditor }
