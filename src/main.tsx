import * as React from "react"
import { RouterProvider } from "react-router-dom"
import * as ReactDOM from "react-dom/client"
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
  darkTheme,
} from "decentraland-ui2"
import { router } from "./components/Router/Router"
// import { config } from "./config"
import { AuthProvider } from "./context/AuthProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CssVarsProvider theme={darkTheme}>
    <CssBaseline />
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  </CssVarsProvider>
)
