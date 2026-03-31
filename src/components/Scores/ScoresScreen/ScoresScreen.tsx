import * as React from "react"
import { Paper } from "decentraland-ui2"
import { ScoresList } from "../ScoresList/ScoresList"
import { SelectedGameProvider } from "../ScoresList/SelectedGameContext"

const ScoresScreen = React.memo(() => {
  return (
    <Paper>
      <SelectedGameProvider>
        <ScoresList />
      </SelectedGameProvider>
    </Paper>
  )
})

export { ScoresScreen }
