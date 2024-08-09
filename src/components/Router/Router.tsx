import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import { locations } from "../../modules/Locations"
import { Challenges } from "../Challenges/Challenges"
import { Games } from "../Games/Games"
import { Layout } from "../Layout/Layout"
import { SignIn } from "../Layout/SignIn"
import { Missions } from "../Missions/Missions"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={locations.root()} element={<Layout />}>
        <Route path={locations.signIn()} element={<SignIn />} />
        <Route path={locations.missions()} element={<Missions />} />
        <Route path={locations.games()} element={<Games />} />
        <Route path={locations.challenges()} element={<Challenges />} />
      </Route>
    </Route>
  )
)

export { router }
