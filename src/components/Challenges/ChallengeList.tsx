import * as React from "react"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
} from "decentraland-ui2"
import { ChallengeEditor } from "./ChallengeEditor"
import { ChallengeResponse, GameResponse } from "../../types"

type ChallengeListProps = {
  challengesData: ChallengeResponse[]
  gamesData: GameResponse[]
  onUpdate: () => void
}

const ChallengeList = ({
  challengesData,
  gamesData,
  onUpdate,
}: ChallengeListProps) => {
  const [open, setOpen] = React.useState(false)
  const [challengeData, setChallengeData] =
    React.useState<ChallengeResponse | null>(null)

  return (
    <React.Fragment>
      <List>
        {challengesData.map((challenge) => {
          const game = gamesData.find((game) => game.id === challenge.game_id)
          return (
            <ListItem key={challenge.id}>
              <ListItemButton
                onClick={() => {
                  setChallengeData(challenge)
                  setOpen(true)
                }}
              >
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
