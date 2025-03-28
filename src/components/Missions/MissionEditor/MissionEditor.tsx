import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "decentraland-ui2"
import { MissionEditorProps } from "./MissionEditor.typed"
import { missionApi } from "../../../api/missionApi"
import { MissionData, MissionType } from "../../../types"
import { compareDataChanged } from "../../../utils/compareDataChanged"
import { ChallengeList } from "../../Challenge/ChallengeList/ChallengeList"
import { SaveButton } from "../../SaveButton/SaveButton"
import { TextFieldStyled } from "../../TextFieldStyled/TextFieldStyled"
import { ColInputs, ColThumb, Columns, Container } from "./MissionEditor.styled"

const EMPTY_DATA: MissionData = {
  mission: {
    id: "",
    description: "",
    campaign_key: "",
    thumb_url: "",
    type: MissionType.MINI_GAMES,
  },
  challenges: [],
  games: [],
}

const MissionEditor = React.memo(
  ({ missionId, onUpdate }: MissionEditorProps) => {
    const [serverData, setServerData] = useState<MissionData>(EMPTY_DATA)

    const [missionData, setMissionData] = useState<MissionData>(EMPTY_DATA)
    const [loadingMissionData, setLoadingMissionData] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dataChanged, setDataChanged] = useState<Record<string, boolean>>({})
    const create = !missionId

    const l = useFormatMessage()

    useEffect(() => {
      fetchMissionData()
    }, [missionId])

    useEffect(() => {
      setDataChanged(
        compareDataChanged(serverData.mission, missionData.mission)
      )
    }, [serverData, missionData])

    const fetchMissionData = useCallback(async () => {
      if (missionId) {
        try {
          setLoadingMissionData(true)
          const data = await missionApi.getMissionById(missionId)
          setServerData(data)
          setMissionData(data)
        } catch (err) {
          setError("Failed to fetch missions")
        } finally {
          setLoadingMissionData(false)
        }
      }
    }, [missionId])

    const saveClickHandler = useCallback(async () => {
      if (
        !(
          missionData.mission.description &&
          missionData.mission.campaign_key &&
          missionData.mission.thumb_url &&
          missionData.mission.type
        )
      ) {
        return
      }

      const body = {
        description: missionData.mission.description,
        campaign_key: missionData.mission.campaign_key,
        thumb_url: missionData.mission.thumb_url,
        type: missionData.mission.type,
      }

      if (create) {
        await missionApi.createMission(body)
      } else {
        await missionApi.updateMission(missionId, body)
      }
      fetchMissionData()
      onUpdate && onUpdate()
    }, [missionData, create, missionId, fetchMissionData, onUpdate])

    const hasNewChanges = useMemo(() => {
      return Object.values(dataChanged).some(Boolean)
    }, [dataChanged])

    if (loadingMissionData) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      )
    }

    if (error) {
      return <Box sx={{ color: "error.main" }}>{error}</Box>
    }

    return (
      <>
        <Container>
          {!create && (
            <Typography>
              {l("mission_editor.field_missionId")}: {serverData?.mission.id}
            </Typography>
          )}
          <Columns>
            <ColInputs>
              <TextFieldStyled
                label={l("mission_editor.field_description")}
                value={missionData.mission.description}
                focused={dataChanged.description}
                onChange={(e) =>
                  setMissionData((data) => ({
                    ...data,
                    mission: { ...data.mission, description: e.target.value },
                  }))
                }
                margin="normal"
              />
              <TextFieldStyled
                label={l("mission_editor.field_thumbUrl")}
                focused={dataChanged.thumb_url}
                value={missionData.mission.thumb_url}
                onChange={(e) =>
                  setMissionData((data) => ({
                    ...data,
                    mission: { ...data.mission, thumb_url: e.target.value },
                  }))
                }
                margin="normal"
              />
              <TextFieldStyled
                label={l("mission_editor.field_campaignKey")}
                focused={dataChanged.campaign_key}
                value={missionData.mission.campaign_key}
                onChange={(e) =>
                  setMissionData((data) => ({
                    ...data,
                    mission: { ...data.mission, campaign_key: e.target.value },
                  }))
                }
                margin="normal"
              />

              <FormControl
                focused={dataChanged.type}
                color={dataChanged.type ? "warning" : "success"}
                variant="standard"
                margin="normal"
              >
                <InputLabel id="mission-type-label">
                  {l("mission_editor.field_type")}
                </InputLabel>
                <Select
                  labelId="mission-type-label"
                  label={l("mission_editor.field_type")}
                  value={missionData.mission.type}
                  onChange={(e) =>
                    setMissionData((data) => ({
                      ...data,
                      mission: {
                        ...data.mission,
                        type: e.target.value as MissionType,
                      },
                    }))
                  }
                >
                  {Object.values(MissionType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ColInputs>
            <ColThumb
              src={`${missionData.mission.thumb_url}`}
              onError={(e) => {
                e.currentTarget.src = "/invalid_url.png"
              }}
            />
          </Columns>
          <SaveButton disabled={!hasNewChanges} onClick={saveClickHandler} />
        </Container>
        <Divider />
        {serverData?.mission.id && (
          <ChallengeList
            challenges={serverData.challenges}
            games={serverData.games}
            mission={serverData.mission}
            onUpdate={onUpdate}
          />
        )}
      </>
    )
  }
)

export { MissionEditor }
