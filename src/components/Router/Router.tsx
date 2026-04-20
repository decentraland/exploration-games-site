import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import { locations } from "../../modules/Locations"
import { GamesScreen } from "../Games/GamesScreen/GamesScreen"
import { Layout } from "../Layout/Layout"
import { SignIn } from "../Layout/SignIn"
import { MissionsScreen } from "../Missions/MissionsScreen/MissionsScreen"
import { ScoresScreen } from "../Scores/ScoresScreen/ScoresScreen"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={locations.root()} element={<Layout />}>
        <Route path={locations.signIn()} element={<SignIn />} />
        <Route path={locations.games()} element={<GamesScreen />} />
        <Route path={locations.missions()} element={<MissionsScreen />} />
        <Route path={locations.scores()} element={<ScoresScreen />} />
      </Route>
    </Route>
  ),
  {
    // TODO: apply the final basename
    basename: /^decentraland.(zone|org|today)$/.test(window.location.host)
      ? "/exploration-games"
      : "",
  }
)

export { router }
