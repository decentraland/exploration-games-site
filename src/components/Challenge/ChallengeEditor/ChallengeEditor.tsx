import * as React from "react"
import { Button, Dialog, DialogContent, TextField } from "decentraland-ui2"
import {
  ChallengeEditorData,
  ChallengeEditorProps,
} from "./ChallengeEditor.typed"
import { challengeService } from "../../../services/challengeService"
import { ChallengeRequest } from "../../../types"
import { Games } from "../../Games/Games/Games"
import { MissionList } from "../../Missions/MissionList/MissionList"
import { ChallengeEditorContainer } from "./ChallengeEditor.styled"

const ChallengeEditor = ({ challengeData, onUpdate }: ChallengeEditorProps) => {
  const emptyChallenge = {
    id: "",
    mission_id: challengeData?.mission_id || "",
    game_id: "",
    description: "",
    target_level: 0,
    missionName: challengeData?.missionName || "",
    gameName: "",
  } as ChallengeEditorData

  const create = !challengeData?.id
  const initData = create ? emptyChallenge : challengeData
  const [openGames, setOpenGames] = React.useState(false)
  const [openMissions, setOpenMissions] = React.useState(false)
  const [missionId, setMissionId] = React.useState<string>(
    initData?.mission_id || ""
  )
  const [missionName, setMissionName] = React.useState<string>(
    initData?.missionName || ""
  )
  const [gameId, setGameId] = React.useState<string>(initData?.game_id || "")
  const [gameName, setGameName] = React.useState<string>(
    initData?.gameName || ""
  )
  const [description, setDescription] = React.useState<string>(
    initData?.description || ""
  )
  const [targetLevel, setTargetLevel] = React.useState<number>(
    initData?.target_level || 0
  )
  const [data, setData] = React.useState(initData?.data || {})
  const [jsonError, setJsonError] = React.useState<string | null>(null)
  const [jsonInput, setJsonInput] = React.useState<string>(
    JSON.stringify(data, null, 2)
  )
  const onSaveHandler = async () => {
    if (!(description && gameId && missionId && targetLevel)) return

    const body = {
      description,
      gameId,
      missionId,
      targetLevel,
    } as ChallengeRequest

    if (Object.keys(data).length > 0) {
      body.data = data
    }

    if (create) {
      await challengeService.createChallenge(body)
    } else {
      await challengeService.updateChallenge(initData?.id, body)
    }

    onUpdate && onUpdate()
  }

  const dataChanged = create
    ? gameId && missionId && description && targetLevel
    : description !== initData?.description ||
      gameId !== initData?.game_id ||
      missionId !== initData?.mission_id ||
      targetLevel !== initData?.target_level ||
      JSON.stringify(data) !== JSON.stringify(initData?.data)

  return (
    <ChallengeEditorContainer>
      <TextField
        label="Mission (click to select)"
        variant="standard"
        value={`${missionName} - ${missionId}`}
        focused={missionId !== initData?.mission_id}
        color={missionId !== initData?.mission_id ? "warning" : "secondary"}
        onClick={() => setOpenMissions(true)}
      />
      <TextField
        label="Game (click to select)"
        variant="standard"
        InputProps={{
          readOnly: true,
        }}
        color={gameId !== initData?.game_id ? "warning" : "secondary"}
        focused={gameId !== initData?.game_id}
        value={`${gameName} - ${gameId}`}
        onClick={() => setOpenGames(true)}
      />
      <TextField
        label="Description"
        variant="standard"
        value={description}
        focused={description !== initData?.description}
        color={description !== initData?.description ? "warning" : "secondary"}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        label="Target Level"
        variant="standard"
        type="number"
        value={targetLevel}
        focused={targetLevel !== initData?.target_level}
        color={targetLevel !== initData?.target_level ? "warning" : "secondary"}
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
          JSON.stringify(data) !== JSON.stringify(initData?.data)
            ? "warning"
            : "secondary"
        }
        focused={JSON.stringify(data) !== JSON.stringify(initData?.data)}
      />
      <Button
        variant="contained"
        sx={{ maxWidth: "250px", alignSelf: "flex-end" }}
        disabled={!dataChanged}
        onClick={() => onSaveHandler()}
      >
        Save changes
      </Button>
      <Dialog
        open={openGames}
        onClose={() => setOpenGames(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Games
            onSelect={(gameId: string, gameName: string) => {
              setOpenGames(false)
              gameId && setGameId(gameId)
              gameName && setGameName(gameName)
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openMissions}
        onClose={() => setOpenMissions(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <MissionList
            onSelect={(missionId: string, missionName: string) => {
              setOpenMissions(false)
              missionId && setMissionId(missionId)
              missionName && setMissionName(missionName)
            }}
          />
        </DialogContent>
      </Dialog>
    </ChallengeEditorContainer>
  )
}

export { ChallengeEditor }
