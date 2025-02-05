import { RouterProvider } from "react-router-dom"
import AuthProvider from "decentraland-gatsby/dist/context/Auth/AuthProvider"
import * as ReactDOM from "react-dom/client"
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
  darkTheme,
} from "decentraland-ui2"
import { router } from "./components/Router/Router"
import { config } from "./config"

const ssoUrl = config.get("SSO_URL")

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CssVarsProvider theme={darkTheme}>
    <CssBaseline />
    {/* @ts-expect-error AuthProvider type definition issue */}
    <AuthProvider sso={ssoUrl}>
      <RouterProvider router={router} />
    </AuthProvider>
  </CssVarsProvider>
)
