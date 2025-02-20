// eslint-disable-next-line import/default
import React, { useCallback, useState } from "react"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
} from "decentraland-ui2"
import { AddButton } from "../../AddButton/AddButton"
import { ChallengeEditor } from "../ChallengeEditor/ChallengeEditor"
import { ChallengeEditorDataProps } from "../ChallengeEditor/ChallengeEditor.typed"
import { ChallengeListProps } from "./ChallengeList.types"
import { ChallengeJsonFormatted, GameLabel } from "./ChallengeList.styled"

const ChallengeList = React.memo((props: ChallengeListProps) => {
  const { challengesData, gamesData, missionData, onUpdate } = props
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
          {l("challenge_list.challenges")}
        </Typography>
        <AddButton onClick={createChallengeHandler}>{l("challenge")}</AddButton>
      </Toolbar>
      <List>
        {challengesData
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((challenge) => {
            const game = gamesData.find((game) => game.id === challenge.game_id)

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
                      <Typography>
                        {l("challenge_list.game")}:
                        <GameLabel
                          color={game?.id ? "success.main" : "error.main"}
                        >
                          {game?.id
                            ? `${game?.name} (${game?.parcel})`
                            : l("challenge_list.game_not_found")}
                        </GameLabel>
                      </Typography>
                    </Box>
                    <Typography>
                      {l("challenge_list.description")}: {challenge.description}
                    </Typography>
                    <Typography>
                      {l("challenge_list.target_level")}:{" "}
                      {challenge.target_level}
                    </Typography>
                    {challenge.data && (
                      <>
                        <Typography>{l("challenge_list.data")}:</Typography>
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
              onUpdate && onUpdate()
            }}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
})

export { ChallengeList }
