import * as React from "react"
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from "decentraland-ui2"
import { missionService } from "../../services/missionService"
import { MissionData } from "../../types"

interface MissionEditorProps {
  missionId: string | null
}

const MissionEditor = ({ missionId }: MissionEditorProps) => {
  const [missionData, setMissionData] = React.useState<MissionData | null>(null)
  const [loadingMissionData, setLoadingMissionData] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (missionId) {
      const fetchMissionData = async () => {
        try {
          setLoadingMissionData(true)
          const data = await missionService.getMissionById(missionId)
          setMissionData(data)
        } catch (err) {
          setError("Failed to fetch missions")
        } finally {
          setLoadingMissionData(false)
        }
      }

      fetchMissionData()
    }
  }, [missionId])

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

  if (!missionData) return null

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Typography> Mission id: {missionData.mission.id}</Typography>
        <TextField
          label="Description"
          variant="standard"
          value={missionData.mission.description}
        />
        <TextField
          label="Campaign Key"
          variant="standard"
          value={missionData.mission.campaign_key}
        />
      </Box>
      <Typography>Challenges:</Typography>
      <List>
        {missionData.challenges?.map((challenge) => {
          const game = missionData.games.find(
            (game) => game.id === challenge.game_id
          )
          return (
            <ListItem key={challenge.id}>
              <Box>
                <Box>
                  Game:
                  <Box
                    component="span"
                    color={game?.id ? "success.main" : "error.main"}
                    sx={{ ml: 1, mr: 1 }}
                  >
                    {game?.id
                      ? `${game?.name} (${game?.parcel})`
                      : "Game not found"}
                  </Box>
                  {challenge.game_id}
                </Box>
                <Box>Description: {challenge.description}</Box>
                <Box>Level: {challenge.target_level}</Box>
                {challenge.data && <Box> Data: </Box>}
                {challenge.data && (
                  <Box component="pre" sx={{ fontSize: "0.8rem" }}>
                    {JSON.stringify(challenge.data, null, 2)}
                  </Box>
                )}
              </Box>
            </ListItem>
          )
        })}
      </List>
    </React.Fragment>
  )
}

export { MissionEditor }
