import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import { locations } from "../../modules/Locations"
import { Games } from "../Games/Games/Games"
import { Layout } from "../Layout/Layout"
import { SignIn } from "../Layout/SignIn"
import { MissionsScreen } from "../Missions/MissionsScreen/MissionsScreen"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={locations.root()} element={<Layout />}>
        <Route path={locations.signIn()} element={<SignIn />} />
        <Route path={locations.games()} element={<Games />} />
        <Route path={locations.missions()} element={<MissionsScreen />} />
      </Route>
    </Route>
  ),
  {
    // TODO: apply the final basename
    basename: process.env.NODE_ENV === "production" ? "/mini-game" : undefined,
  }
)

export { router }
