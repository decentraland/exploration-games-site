import * as React from "react"
import {
  Box,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "decentraland-ui2"
import { MissionEditorProps } from "./MissionEditor.typed"
import { missionService } from "../../../services/missionService"
import { MissionData } from "../../../types"
import { ChallengeList } from "../../Challenge/ChallengeList/ChallengeList"
import {
  MissionEditorContainer,
  MissionEditorSaveButton,
} from "./MissionEditor.styled"

const MissionEditor = ({ missionId, onUpdate }: MissionEditorProps) => {
  const emptyServerData: MissionData = {
    mission: {
      id: "",
      description: "",
      campaign_key: "",
    },
    challenges: [],
    games: [],
  }
  const [serverData, setServerData] =
    React.useState<MissionData>(emptyServerData)
  const [description, setDescription] = React.useState("")
  const [campaignKey, setCampaignKey] = React.useState("")
  const [loadingMissionData, setLoadingMissionData] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const create = !missionId

  React.useEffect(() => {
    fetchMissionData()
  }, [missionId])

  const fetchMissionData = async () => {
    if (missionId) {
      try {
        setLoadingMissionData(true)
        const data = await missionService.getMissionById(missionId)
        setServerData(data)
        setDescription(data.mission.description)
        setCampaignKey(data.mission.campaign_key)
      } catch (err) {
        setError("Failed to fetch missions")
      } finally {
        setLoadingMissionData(false)
      }
    }
  }

  const saveClickHandler = async () => {
    if (!(description && campaignKey)) return

    const body = {
      description,
      campaign_key: campaignKey,
    }

    if (create) {
      await missionService.createMission(body)
    } else {
      await missionService.updateMission(missionId, body)
    }
    fetchMissionData()
    onUpdate && onUpdate()
  }

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

  // if (!serverData) return null

  const dataChanged =
    description !== serverData?.mission.description ||
    campaignKey !== serverData?.mission.campaign_key

  return (
    <React.Fragment>
      <MissionEditorContainer>
        {!create && (
          <Typography> Mission id: {serverData?.mission.id}</Typography>
        )}
        <TextField
          label="Description"
          variant="standard"
          value={description}
          focused={description !== serverData?.mission.description}
          color={
            description !== serverData?.mission.description
              ? "warning"
              : "success"
          }
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Campaign Key"
          variant="standard"
          color={
            campaignKey !== serverData?.mission.campaign_key
              ? "warning"
              : "success"
          }
          focused={campaignKey !== serverData?.mission.campaign_key}
          value={campaignKey}
          onChange={(e) => setCampaignKey(e.target.value)}
        />
        <MissionEditorSaveButton
          variant="contained"
          disabled={!dataChanged}
          onClick={() => saveClickHandler()}
        >
          Save changes
        </MissionEditorSaveButton>
      </MissionEditorContainer>
      <Divider />
      {serverData?.mission.id && (
        <ChallengeList
          challengesData={serverData.challenges}
          gamesData={serverData.games}
          missionData={serverData.mission}
          onUpdate={() => onUpdate && onUpdate()}
        />
      )}
    </React.Fragment>
  )
}

export { MissionEditor }
