import * as React from "react"
import { Box, Button, TextField, Typography } from "decentraland-ui2"
import { gameService } from "../../services/gameService"
import { GameResponse } from "../../types"

interface GameEditorProps {
  gameData: GameResponse | null
  onUpdate?: () => void
}

const GameEditor = ({ gameData, onUpdate }: GameEditorProps) => {
  const [name, setName] = React.useState(gameData?.name || "")
  const [parcelX, setParcelX] = React.useState(
    parseInt(gameData?.parcel?.split(",")[0] || "0")
  )
  const [parcelY, setParcelY] = React.useState(
    parseInt(gameData?.parcel?.split(",")[1] || "0")
  )

  const updateGame = async () => {
    if (!(gameData?.id && parcelX && parcelY)) return

    const body = {
      name,
      x: parcelX,
      y: parcelY,
    }

    await gameService.updateGame(gameData?.id, body)
    onUpdate && onUpdate()
  }

  if (!gameData) return null

  const dataChanged =
    name !== gameData.name ||
    parcelX !== parseInt(gameData.parcel?.split(",")[0] || "0") ||
    parcelY !== parseInt(gameData.parcel?.split(",")[1] || "0")

  return (
    <React.Fragment>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "10px", mb: 2 }}
      >
        <Typography> Game ID: {gameData.id}</Typography>
        <TextField
          label="Name"
          variant="standard"
          value={name}
          focused={name !== gameData.name}
          color={name !== gameData.name ? "warning" : "success"}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Parcel X:"
          variant="standard"
          type="number"
          color={
            parcelX.toString() !== gameData.parcel?.split(",")[0]
              ? "warning"
              : "success"
          }
          focused={parcelX.toString() !== gameData.parcel?.split(",")[0]}
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
            parcelY.toString() !== gameData.parcel?.split(",")[1]
              ? "warning"
              : "success"
          }
          focused={parcelY.toString() !== gameData.parcel?.split(",")[1]}
          value={parcelY}
          onChange={(e) => setParcelY(parseInt(e.target.value))}
          error={isNaN(parcelY)}
          helperText={!parcelY ? "Parcel Y is required" : ""}
        />
        <Button
          variant="contained"
          sx={{ maxWidth: "250px", alignSelf: "flex-end" }}
          disabled={!dataChanged}
          onClick={() => updateGame()}
        >
          Save changes
        </Button>
      </Box>
    </React.Fragment>
  )
}

export { GameEditor }
