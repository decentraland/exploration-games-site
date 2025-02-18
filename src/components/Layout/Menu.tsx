import { useNavigate } from "react-router-dom"
import useFormatMessage from "decentraland-gatsby/dist/hooks/useFormatMessage"
import { AppBar, Box, Button, Container, Toolbar } from "decentraland-ui2"
import { locations } from "../../modules/Locations"
const pages = [
  {
    name: "missions",
    path: locations.missions(),
  },
  {
    name: "games",
    path: locations.games(),
  },
]

const Menu = () => {
  const navigate = useNavigate()
  const l = useFormatMessage()
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {pages.map((page) => (
              <Button
                variant="text"
                key={page.name}
                onClick={() => {
                  navigate(page.path)
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {l(page.name)}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export { Menu }
