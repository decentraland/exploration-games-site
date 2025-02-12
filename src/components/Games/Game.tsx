import { Box, Paper, Toolbar, Typography } from "decentraland-ui2"
import { GameList } from "./GameList"

function GameListToolbar() {
  return (
    <Toolbar>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Games
      </Typography>
    </Toolbar>
  )
}

const Game = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <GameListToolbar />
        <GameList />
      </Paper>
    </Box>
  )
}

export { Game }
