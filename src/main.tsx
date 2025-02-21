import { RouterProvider } from "react-router-dom"
import AuthProvider from "decentraland-gatsby/dist/context/Auth/AuthProvider"
import IntlProvider from "decentraland-gatsby/dist/plugins/intl/IntlProvider"
import * as ReactDOM from "react-dom/client"
import {
  CssBaseline,
  Experimental_CssVarsProvider as CssVarsProvider,
  darkTheme,
} from "decentraland-ui2"
import { router } from "./components/Router/Router"
import en from "./intl/en.json"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CssVarsProvider theme={darkTheme}>
    <CssBaseline />
    <IntlProvider locale="en" messages={en} defaultLocale="en">
      {/* @ts-expect-error AuthProvider type definition issue */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </IntlProvider>
  </CssVarsProvider>
)
