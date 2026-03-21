import * as React from "react"
import { Paper } from "decentraland-ui2"
import { ScoresList } from "../ScoresList/ScoresList"

const ScoresScreen = React.memo(() => {
  return (
    <Paper>
      <ScoresList />
    </Paper>
  )
})

export { ScoresScreen }
