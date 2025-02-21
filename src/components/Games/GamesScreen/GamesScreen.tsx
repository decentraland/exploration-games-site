import * as React from "react"
import { Paper } from "decentraland-ui2"
import { GamesList } from "../GamesList/GamesList"

const GamesScreen = React.memo(() => {
  return (
    <Paper>
      <GamesList />
    </Paper>
  )
})

export { GamesScreen }
