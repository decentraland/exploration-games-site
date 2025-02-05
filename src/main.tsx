import { RouterProvider } from "react-router-dom"
import AuthProvider from "decentraland-gatsby/dist/context/Auth/AuthProvider"
import * as ReactDOM from "react-dom/client"
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
  darkTheme,
} from "decentraland-ui2"
import { router } from "./components/Router/Router"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CssVarsProvider theme={darkTheme}>
    <CssBaseline />
    {/* @ts-expect-error AuthProvider type definition issue */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </CssVarsProvider>
)
