// eslint-disable-next-line import/default
import React, { useCallback, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
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
import { ChallengeEditorDataProps } from "../ChallengeEditor/ChallengeEditor.typed"
import { ChallengeListProps } from "./ChallengeList.types"
import { ChallengeJsonFormatted, GameLabel } from "./ChallengeList.styled"

const ChallengeList = React.memo(
  ({
    challengesData,
    gamesData,
    missionData,
    onUpdate,
  }: ChallengeListProps) => {
    const [open, setOpen] = useState(false)
    const [challengeData, setChallengeData] =
      useState<ChallengeEditorDataProps | null>(null)

    const l = useFormatMessage()

    const createChallengeHandler = useCallback(() => {
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
    }, [missionData])

    return (
      <React.Fragment>
        <Toolbar>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {l("challenges")}
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={createChallengeHandler}
          >
            {l("challenge")}
          </Button>
        </Toolbar>
        <List>
          {challengesData
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((challenge) => {
              const game = gamesData.find(
                (game) => game.id === challenge.game_id
              )

              const onChallengeClickHandler = useCallback(() => {
                setChallengeData({
                  ...challenge,
                  missionName: missionData?.description,
                  gameName: game?.name,
                })
                setOpen(true)
              }, [challenge, game, missionData])

              return (
                <ListItem key={challenge.id}>
                  <ListItemButton onClick={onChallengeClickHandler}>
                    <Box>
                      <Box>
                        Game:
                        <GameLabel
                          color={game?.id ? "success.main" : "error.main"}
                        >
                          {game?.id
                            ? `${game?.name} (${game?.parcel})`
                            : "Game not found"}
                        </GameLabel>
                      </Box>
                      <Typography>
                        Description: {challenge.description}
                      </Typography>
                      <Typography>Level: {challenge.target_level}</Typography>
                      {challenge.data && (
                        <>
                          <Typography> Data: </Typography>
                          <ChallengeJsonFormatted component={"pre"}>
                            {JSON.stringify(challenge.data, null, 2)}
                          </ChallengeJsonFormatted>
                        </>
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
)

export { ChallengeList }
