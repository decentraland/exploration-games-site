import * as React from "react"
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "decentraland-ui2"
import { missionService } from "../../services/missionService"
import { Mission, MissionData } from "../../types"
import { ChallengeList } from "../Challenges/ChallengeList"

interface MissionEditorProps {
  missionId: string | null
  onUpdate?: () => void
}

const MissionEditor = ({ missionId, onUpdate }: MissionEditorProps) => {
  const [serverData, setServerData] = React.useState<MissionData | null>(null)
  const [description, setDescription] = React.useState("")
  const [campaignKey, setCampaignKey] = React.useState("")
  const [loadingMissionData, setLoadingMissionData] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

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

  const updateMission = async (mission: Mission) => {
    const body = {
      ...mission,
      description,
      campaign_key: campaignKey,
    }
    await missionService.updateMission(body)
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

  if (!serverData) return null

  const dataChanged =
    description !== serverData.mission.description ||
    campaignKey !== serverData.mission.campaign_key

  return (
    <React.Fragment>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "10px", mb: 2 }}
      >
        <Typography> Mission id: {serverData.mission.id}</Typography>
        <TextField
          label="Description"
          variant="standard"
          value={description}
          focused={description !== serverData.mission.description}
          color={
            description !== serverData.mission.description
              ? "warning"
              : "success"
          }
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Campaign Key"
          variant="standard"
          color={
            campaignKey !== serverData.mission.campaign_key
              ? "warning"
              : "success"
          }
          focused={campaignKey !== serverData.mission.campaign_key}
          value={campaignKey}
          onChange={(e) => setCampaignKey(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ maxWidth: "250px", alignSelf: "flex-end" }}
          disabled={!dataChanged}
          onClick={() => updateMission(serverData.mission)}
        >
          Save changes
        </Button>
      </Box>
      <Typography>Challenges:</Typography>
      <ChallengeList
        challengesData={serverData.challenges}
        gamesData={serverData.games}
        onUpdate={() => onUpdate && onUpdate()}
      />
    </React.Fragment>
  )
}

export { MissionEditor }
