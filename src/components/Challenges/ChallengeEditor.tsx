import * as React from "react"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "decentraland-ui2"
import { challengeService } from "../../services/challengeService"
import { ChallengeRequest, ChallengeResponse } from "../../types"
import { GameList } from "../Games/GameList"

interface ChallengeEditorProps {
  challengeData: ChallengeResponse | null
  onUpdate?: () => void
}

const ChallengeEditor = ({ challengeData, onUpdate }: ChallengeEditorProps) => {
  const [openGames, setOpenGames] = React.useState(false)
  const [missionId, setMissionId] = React.useState<string>(
    challengeData?.mission_id || ""
  )
  const [gameId, setGameId] = React.useState<string>(
    challengeData?.game_id || ""
  )
  const [description, setDescription] = React.useState<string>(
    challengeData?.description || ""
  )
  const [targetLevel, setTargetLevel] = React.useState<number>(
    challengeData?.target_level || 0
  )
  const [data, setData] = React.useState(challengeData?.data || {})
  const [jsonError, setJsonError] = React.useState<string | null>(null)
  const [jsonInput, setJsonInput] = React.useState<string>(
    JSON.stringify(data, null, 2)
  )

  const updateChallenge = async () => {
    if (!challengeData?.id) return

    const body = {
      description,
      gameId,
      missionId,
      targetLevel,
    } as ChallengeRequest

    if (Object.keys(data).length > 0) {
      body.data = data
    }
    await challengeService.updateChallenge(challengeData.id, body)
    onUpdate && onUpdate()
  }

  if (!challengeData) {
    return <CircularProgress />
  }

  const dataChanged =
    description !== challengeData.description ||
    gameId !== challengeData.game_id ||
    missionId !== challengeData.mission_id ||
    targetLevel !== challengeData.target_level ||
    JSON.stringify(data) !== JSON.stringify(challengeData.data)

  return (
    <React.Fragment>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "10px", mb: 2 }}
      >
        <TextField
          label="Mission ID"
          variant="standard"
          value={missionId}
          focused={missionId !== challengeData.mission_id}
          color={
            missionId !== challengeData.mission_id ? "warning" : "secondary"
          }
          onChange={(e) => setMissionId(e.target.value)}
        />
        <TextField
          label="Game ID (click to select)"
          variant="standard"
          InputProps={{
            readOnly: true,
          }}
          color={gameId !== challengeData.game_id ? "warning" : "secondary"}
          focused={gameId !== challengeData.game_id}
          value={gameId}
          onClick={() => setOpenGames(true)}
        />
        <TextField
          label="Description"
          variant="standard"
          value={description}
          focused={description !== challengeData.description}
          color={
            description !== challengeData.description ? "warning" : "secondary"
          }
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Target Level"
          variant="standard"
          type="number"
          value={targetLevel}
          focused={targetLevel !== challengeData.target_level}
          color={
            targetLevel !== challengeData.target_level ? "warning" : "secondary"
          }
          onChange={(e) => setTargetLevel(Number(e.target.value))}
        />
        <TextField
          label="Data in JSON format. Use {} for empty data"
          variant="standard"
          type="text"
          multiline
          rows={10}
          value={jsonInput}
          error={!!jsonError}
          helperText={jsonError}
          onChange={(e) => {
            const inputValue = e.target.value
            setJsonInput(inputValue)
            try {
              const parsedData = JSON.parse(inputValue)
              setData(parsedData)
              setJsonError(null)
            } catch (error) {
              setJsonError("Invalid JSON format")
            }
          }}
          color={
            Object.keys(data).length > 0 &&
            JSON.stringify(data) !== JSON.stringify(challengeData.data)
              ? "warning"
              : "secondary"
          }
          focused={JSON.stringify(data) !== JSON.stringify(challengeData.data)}
        />
        <Button
          variant="contained"
          sx={{ maxWidth: "250px", alignSelf: "flex-end" }}
          disabled={!dataChanged}
          onClick={() => updateChallenge()}
        >
          Save changes
        </Button>
      </Box>
      <Dialog
        open={openGames}
        onClose={() => setOpenGames(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Games selection</DialogTitle>
        <DialogContent>
          <GameList
            onSelect={(gameId: string) => {
              setOpenGames(false)
              gameId && setGameId(gameId)
            }}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export { ChallengeEditor }
