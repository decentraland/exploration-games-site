import { useNavigate } from "react-router-dom"
import { AppBar, Box, Button, Container, Toolbar } from "decentraland-ui2"
import { locations } from "../../modules/Locations"

const pages = [
  {
    name: "Missions",
    path: locations.missions(),
  },
  {
    name: "Games",
    path: locations.games(),
  },
  {
    name: "Challenges",
    path: locations.challenges(),
  },
]

const Menu = () => {
  const navigate = useNavigate()
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
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export { Menu }
