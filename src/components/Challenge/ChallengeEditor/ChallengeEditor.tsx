import * as React from "react"
import { useCallback, useMemo, useState } from "react"
import { Dialog, DialogContent, TextField } from "decentraland-ui2"
import {
  ChallengeEditorDataProps,
  ChallengeEditorProps,
} from "./ChallengeEditor.typed"
import { challengeApi } from "../../../api/challengeApi"
import { ChallengeRequest } from "../../../types"
import { Games } from "../../Games/Games/Games"
import { MissionList } from "../../Missions/MissionList/MissionList"
import { Container, SaveButton } from "./ChallengeEditor.styled"

const ChallengeEditor = React.memo(
  ({ challengeData, onUpdate }: ChallengeEditorProps) => {
    const emptyChallenge = useMemo(
      () =>
        ({
          id: "",
          mission_id: challengeData?.mission_id || "",
          game_id: "",
          description: "",
          target_level: 0,
          missionName: challengeData?.missionName || "",
          gameName: "",
        }) as ChallengeEditorDataProps,
      [challengeData]
    )

    const create = useMemo(() => !challengeData?.id, [challengeData])
    const baseData = useMemo(
      () => (create ? emptyChallenge : challengeData),
      [create, emptyChallenge, challengeData]
    )
    const [openGames, setOpenGames] = useState(false)
    const [openMissions, setOpenMissions] = useState(false)
    const [missionId, setMissionId] = useState<string>(
      baseData?.mission_id || ""
    )
    const [missionName, setMissionName] = useState<string>(
      baseData?.missionName || ""
    )
    const [gameId, setGameId] = useState<string>(baseData?.game_id || "")
    const [gameName, setGameName] = useState<string>(baseData?.gameName || "")
    const [description, setDescription] = useState<string>(
      baseData?.description || ""
    )
    const [targetLevel, setTargetLevel] = useState<number>(
      baseData?.target_level || 0
    )
    const [data, setData] = useState(baseData?.data || {})
    const [jsonError, setJsonError] = useState<string | null>(null)
    const [jsonInput, setJsonInput] = useState<string>(
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

      if (!baseData?.id) {
        await challengeApi.createChallenge(body)
      } else {
        await challengeApi.updateChallenge(baseData?.id, body)
      }

      onUpdate && onUpdate()
    }

    const onGameSelect = useCallback((gameId: string, gameName: string) => {
      setOpenGames(false)
      gameId && setGameId(gameId)
      gameName && setGameName(gameName)
    }, [])

    const onMissionSelect = useCallback(
      (missionId: string, missionName: string) => {
        setOpenMissions(false)
        missionId && setMissionId(missionId)
        missionName && setMissionName(missionName)
      },
      []
    )

    const dataChanged = create
      ? gameId && missionId && description && targetLevel
      : description !== baseData?.description ||
        gameId !== baseData?.game_id ||
        missionId !== baseData?.mission_id ||
        targetLevel !== baseData?.target_level ||
        (JSON.stringify(data) === "{}"
          ? baseData?.data
          : JSON.stringify(data) !== JSON.stringify(baseData?.data))

    return (
      <Container>
        <TextField
          label="Mission (click to select)"
          variant="standard"
          value={`${missionName} - ${missionId}`}
          focused={missionId !== baseData?.mission_id}
          color={missionId !== baseData?.mission_id ? "warning" : "secondary"}
          onClick={() => setOpenMissions(true)}
        />
        <TextField
          label="Game (click to select)"
          variant="standard"
          InputProps={{
            readOnly: true,
          }}
          color={gameId !== baseData?.game_id ? "warning" : "secondary"}
          focused={gameId !== baseData?.game_id}
          value={`${gameName} - ${gameId}`}
          onClick={() => setOpenGames(true)}
        />
        <TextField
          label="Description"
          variant="standard"
          value={description}
          focused={description !== baseData?.description}
          color={
            description !== baseData?.description ? "warning" : "secondary"
          }
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Target Level"
          variant="standard"
          type="number"
          value={targetLevel}
          focused={targetLevel !== baseData?.target_level}
          color={
            targetLevel !== baseData?.target_level ? "warning" : "secondary"
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
            JSON.stringify(data) !== JSON.stringify(baseData?.data)
              ? "warning"
              : "secondary"
          }
          focused={JSON.stringify(data) !== JSON.stringify(baseData?.data)}
        />
        <SaveButton disabled={!dataChanged} onClick={() => onSaveHandler()}>
          Save changes
        </SaveButton>
        <Dialog
          open={openGames}
          onClose={() => setOpenGames(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogContent>
            <Games onSelect={onGameSelect} />
          </DialogContent>
        </Dialog>
        <Dialog
          open={openMissions}
          onClose={() => setOpenMissions(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogContent>
            <MissionList onSelect={onMissionSelect} />
          </DialogContent>
        </Dialog>
      </Container>
    )
  }
)

export { ChallengeEditor }
