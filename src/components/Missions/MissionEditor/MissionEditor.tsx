import * as React from "react"
import {
  Box,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "decentraland-ui2"
import { MissionEditorProps } from "./MissionEditor.typed"
import { missionApi } from "../../../api/missionApi"
import { MissionData } from "../../../types"
import { ChallengeList } from "../../Challenge/ChallengeList/ChallengeList"
import { SaveButton } from "../../SaveButton/SaveButton"
import { Container } from "./MissionEditor.styled"

const EMPTY_DATA: MissionData = {
  mission: {
    id: "",
    description: "",
    campaign_key: "",
  },
  challenges: [],
  games: [],
}

const MissionEditor = React.memo(
  ({ missionId, onUpdate }: MissionEditorProps) => {
    const [serverData, setServerData] = React.useState<MissionData>(EMPTY_DATA)

    const [missionData, setMissionData] =
      React.useState<MissionData>(EMPTY_DATA)
    const [loadingMissionData, setLoadingMissionData] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const create = !missionId

    React.useEffect(() => {
      fetchMissionData()
    }, [missionId])

    const fetchMissionData = React.useCallback(async () => {
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

    const saveClickHandler = React.useCallback(async () => {
      if (
        !(missionData.mission.description && missionData.mission.campaign_key)
      )
        return

      const body = {
        description: missionData.mission.description,
        campaign_key: missionData.mission.campaign_key,
      }

      if (create) {
        await missionApi.createMission(body)
      } else {
        await missionApi.updateMission(missionId, body)
      }
      fetchMissionData()
      onUpdate && onUpdate()
    }, [missionData, create, missionId, fetchMissionData, onUpdate])

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

    const descriptionChanged =
      missionData.mission.description !== serverData?.mission.description
    const campaignKeyChanged =
      missionData.mission.campaign_key !== serverData?.mission.campaign_key

    const dataChanged = descriptionChanged || campaignKeyChanged

    return (
      <React.Fragment>
        <Container>
          {!create && (
            <Typography> Mission id: {serverData?.mission.id}</Typography>
          )}
          <TextField
            label="Description"
            variant="standard"
            value={missionData.mission.description}
            focused={descriptionChanged}
            color={descriptionChanged ? "warning" : "success"}
            onChange={(e) =>
              setMissionData((data) => ({
                ...data,
                mission: { ...data.mission, description: e.target.value },
              }))
            }
          />
          <TextField
            label="Campaign Key"
            variant="standard"
            color={campaignKeyChanged ? "warning" : "success"}
            focused={campaignKeyChanged}
            value={missionData.mission.campaign_key}
            onChange={(e) =>
              setMissionData((data) => ({
                ...data,
                mission: { ...data.mission, campaign_key: e.target.value },
              }))
            }
          />
          <SaveButton disabled={!dataChanged} onClick={saveClickHandler} />
        </Container>
        <Divider />
        {serverData?.mission.id && (
          <ChallengeList
            challengesData={serverData.challenges}
            gamesData={serverData.games}
            missionData={serverData.mission}
            onUpdate={onUpdate}
          />
        )}
      </React.Fragment>
    )
  }
)

export { MissionEditor }
