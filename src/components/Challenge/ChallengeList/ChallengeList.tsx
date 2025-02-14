import * as React from "react"
import { Add } from "@mui/icons-material"
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
} from "decentraland-ui2"
import { ChallengeEditor } from "../ChallengeEditor/ChallengeEditor"
import { ChallengeEditorData } from "../ChallengeEditor/ChallengeEditor.typed"
import { ChallengeListProps } from "./ChallengeList.types"
import { ChallengeDataBox, GameBox } from "./ChallengeList.styled"

const ChallengeList = ({
  challengesData,
  gamesData,
  missionData,
  onUpdate,
}: ChallengeListProps) => {
  const [open, setOpen] = React.useState(false)
  const [challengeData, setChallengeData] =
    React.useState<ChallengeEditorData | null>(null)

  return (
    <React.Fragment>
      <Toolbar>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Challenges
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={() => {
            setChallengeData({
              mission_id: missionData?.id,
              missionName: missionData?.description,
              game_id: "",
              gameName: "",
              description: "",
              target_level: 0,
              id: "",
            })
            setOpen(true)
          }}
        >
          challenge
        </Button>
      </Toolbar>
      <List>
        {challengesData
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((challenge) => {
            const game = gamesData.find((game) => game.id === challenge.game_id)
            return (
              <ListItem key={challenge.id}>
                <ListItemButton
                  onClick={() => {
                    setChallengeData({
                      ...challenge,
                      missionName: missionData?.description,
                      gameName: game?.name,
                    })
                    setOpen(true)
                  }}
                >
                  <Box>
                    <Box>
                      Game:
                      <GameBox color={game?.id ? "success.main" : "error.main"}>
                        {game?.id
                          ? `${game?.name} (${game?.parcel})`
                          : "Game not found"}
                      </GameBox>
                    </Box>
                    <Box>Description: {challenge.description}</Box>
                    <Box>Level: {challenge.target_level}</Box>
                    {challenge.data && <Box> Data: </Box>}
                    {challenge.data && (
                      <ChallengeDataBox component={"pre"}>
                        {JSON.stringify(challenge.data, null, 2)}
                      </ChallengeDataBox>
                    )}
                  </Box>
                </ListItemButton>
              </ListItem>
            )
          })}
      </List>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Challenge</DialogTitle>
        <DialogContent>
          <ChallengeEditor
            challengeData={challengeData}
            onUpdate={() => {
              setOpen(false)
              onUpdate()
            }}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export { ChallengeList }
