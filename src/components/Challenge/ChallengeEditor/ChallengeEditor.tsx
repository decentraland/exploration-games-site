import * as React from "react"
import { useCallback, useMemo, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { Dialog, DialogContent } from "decentraland-ui2"
import {
  ChallengeEditorDataProps,
  ChallengeEditorProps,
} from "./ChallengeEditor.typed"
import { challengeApi } from "../../../api/challengeApi"
import { ChallengeRequest } from "../../../types"
import { GamesList } from "../../Games/GamesList/GamesList"
import { MissionList } from "../../Missions/MissionList/MissionList"
import { SaveButton } from "../../SaveButton/SaveButton"
import { TextFieldStyled } from "../../TextFieldStyled/TextFieldStyled"
import { Container } from "./ChallengeEditor.styled"

const ChallengeEditor = React.memo(
  ({ challengeData, onUpdate }: ChallengeEditorProps) => {
    const emptyChallenge = useMemo<ChallengeEditorDataProps>(
      () => ({
        id: "",
        mission_id: challengeData?.mission_id || "",
        game_id: "",
        description: "",
        target_level: 0,
        missionName: challengeData?.missionName || "",
        gameName: "",
      }),
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

    const l = useFormatMessage()
    const onSaveHandler = useCallback(async () => {
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
    }, [baseData?.id, missionData, onUpdate])

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

    const missionChanged = useMemo(
      () => missionData.mission_id !== baseData?.mission_id,
      [missionData.mission_id, baseData?.mission_id]
    )
    const gameChanged = useMemo(
      () => missionData.game_id !== baseData?.game_id,
      [missionData.game_id, baseData?.game_id]
    )
    const descriptionChanged = useMemo(
      () => missionData.description !== baseData?.description,
      [missionData.description, baseData?.description]
    )
    const targetLevelChanged = useMemo(
      () => missionData.target_level !== baseData?.target_level,
      [missionData.target_level, baseData?.target_level]
    )
    const dataChanged = useMemo(
      () => JSON.stringify(missionData.data) !== JSON.stringify(baseData?.data),
      [missionData.data, baseData?.data]
    )

    const newChanges = useMemo(() => {
      return create
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
    }, [
      create,
      missionData,
      baseData,
      descriptionChanged,
      gameChanged,
      missionChanged,
      targetLevelChanged,
      dataChanged,
    ])

    const onDataFieldChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
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
          setJsonError(l("challenge_editor.invalid_json_format"))
        }
      },
      []
    )

    return (
      <Container>
        <TextFieldStyled
          label={l("challenge_editor.field_mission")}
          value={`${missionData.missionName} - ${missionData.mission_id}`}
          focused={missionChanged}
          onClick={() => setOpenMissions(true)}
        />
        <TextFieldStyled
          label={l("challenge_editor.field_game")}
          InputProps={{
            readOnly: true,
          }}
          focused={gameChanged}
          value={`${missionData.gameName} - ${missionData.game_id}`}
          onClick={() => setOpenGames(true)}
        />
        <TextFieldStyled
          label={l("challenge_editor.field_description")}
          value={missionData.description}
          focused={descriptionChanged}
          onChange={(e) =>
            setMissionData((missionData) => ({
              ...missionData,
              description: e.target.value,
            }))
          }
        />
        <TextFieldStyled
          label={l("challenge_editor.field_target_level")}
          type="number"
          value={missionData.target_level}
          focused={targetLevelChanged}
          onChange={(e) =>
            setMissionData((missionData) => ({
              ...missionData,
              target_level: Number(e.target.value),
            }))
          }
        />
        <TextFieldStyled
          label={l("challenge_editor.field_data")}
          type="text"
          multiline
          rows={10}
          value={jsonInput}
          error={!!jsonError}
          helperText={jsonError}
          onChange={onDataFieldChange}
          focused={dataChanged}
        />
        <SaveButton disabled={!newChanges} onClick={onSaveHandler} />
        <Dialog
          open={openGames}
          onClose={() => setOpenGames(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogContent>
            <GamesList onSelect={onGameSelect} />
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
