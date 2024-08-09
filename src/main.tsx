import * as React from "react"
import { RouterProvider } from "react-router-dom"
import { dark } from "decentraland-ui2/dist/theme"
import * as ReactDOM from "react-dom/client"
import { CssBaseline, ThemeProvider } from "decentraland-ui2"
import { router } from "./components/Router/Router"
// import { config } from "./config"
import { AuthProvider } from "./context/AuthProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={dark}>
    <CssBaseline />
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  </ThemeProvider>
)
