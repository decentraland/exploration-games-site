import * as React from "react"
import { Paper } from "decentraland-ui2"
import { MissionList } from "../MissionList/MissionList"

const MissionsScreen = React.memo(() => {
  return (
    <Paper>
      <MissionList />
    </Paper>
  )
})

export { MissionsScreen }
