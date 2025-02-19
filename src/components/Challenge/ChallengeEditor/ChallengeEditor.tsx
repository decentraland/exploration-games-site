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
import { SaveButton } from "../../SaveButton/SaveButton"
import { Container } from "./ChallengeEditor.styled"

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
    const [missionData, setMissionData] = useState<ChallengeEditorDataProps>(
      baseData || emptyChallenge
    )
    const [jsonError, setJsonError] = useState<string | null>(null)
    const [jsonInput, setJsonInput] = useState<string>(
      JSON.stringify(missionData.data, null, 2)
    )

    const onSaveHandler = async () => {
      if (
        !(
          missionData.description &&
          missionData.game_id &&
          missionData.mission_id &&
          missionData.target_level
        )
      )
        return

      const body = {
        description: missionData.description,
        gameId: missionData.game_id,
        missionId: missionData.mission_id,
        targetLevel: missionData.target_level,
      } as ChallengeRequest

      if (Object.keys(missionData.data || {}).length > 0) {
        body.data = missionData.data
      }

      if (!baseData?.id) {
        await challengeApi.createChallenge(body)
      } else {
        await challengeApi.updateChallenge(baseData?.id, body)
      }

      onUpdate && onUpdate()
    }

    const onGameSelect = useCallback((game_id: string, gameName: string) => {
      setOpenGames(false)
      setMissionData((data) => ({
        ...data,
        game_id,
        gameName,
      }))
    }, [])

    const onMissionSelect = useCallback(
      (mission_id: string, missionName: string) => {
        setOpenMissions(false)
        setMissionData((data) => ({
          ...data,
          mission_id,
          missionName,
        }))
      },
      []
    )

    const missionChanged = missionData.mission_id !== baseData?.mission_id
    const gameChanged = missionData.game_id !== baseData?.game_id
    const descriptionChanged = missionData.description !== baseData?.description
    const targetLevelChanged =
      missionData.target_level !== baseData?.target_level
    const dataChanged =
      JSON.stringify(missionData.data) !== JSON.stringify(baseData?.data)

    const newChanges = create
      ? missionData.game_id &&
        missionData.mission_id &&
        missionData.description &&
        missionData.target_level
      : descriptionChanged ||
          gameChanged ||
          missionChanged ||
          targetLevelChanged ||
          JSON.stringify(missionData.data) === "{}"
        ? baseData?.data
        : dataChanged

    return (
      <Container>
        <TextField
          label="Mission (click to select)"
          variant="standard"
          value={`${missionData.missionName} - ${missionData.mission_id}`}
          focused={missionChanged}
          color={missionChanged ? "warning" : "secondary"}
          onClick={() => setOpenMissions(true)}
        />
        <TextField
          label="Game (click to select)"
          variant="standard"
          InputProps={{
            readOnly: true,
          }}
          color={gameChanged ? "warning" : "secondary"}
          focused={gameChanged}
          value={`${missionData.gameName} - ${missionData.game_id}`}
          onClick={() => setOpenGames(true)}
        />
        <TextField
          label="Description"
          variant="standard"
          value={missionData.description}
          focused={descriptionChanged}
          color={descriptionChanged ? "warning" : "secondary"}
          onChange={(e) =>
            setMissionData((missionData) => ({
              ...missionData,
              description: e.target.value,
            }))
          }
        />
        <TextField
          label="Target Level"
          variant="standard"
          type="number"
          value={missionData.target_level}
          focused={targetLevelChanged}
          color={targetLevelChanged ? "warning" : "secondary"}
          onChange={(e) =>
            setMissionData((missionData) => ({
              ...missionData,
              target_level: Number(e.target.value),
            }))
          }
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
              setMissionData((missionData) => ({
                ...missionData,
                data: parsedData,
              }))
              setJsonError(null)
            } catch (error) {
              setJsonError("Invalid JSON format")
            }
          }}
          color={dataChanged ? "warning" : "secondary"}
          focused={dataChanged}
        />
        <SaveButton disabled={!newChanges} onClick={() => onSaveHandler()} />
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
