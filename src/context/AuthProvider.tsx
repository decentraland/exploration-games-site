import { createContext, useContext } from "react"
// import * as SSO from "@dcl/single-sign-on-client"
// import isURL from "validator/lib/isURL"
import { useAuth } from "./useAuth"

type AuthProviderProps = {
  // Url of the sso application (Eg: https://id.decentraland.org)
  sso?: string
}

type AuthContextType = ReturnType<typeof useAuth>

const defaultAuthState = [
  null,
  {
    selecting: false,
    loading: true,
    chainId: null,
    providerType: null,
    provider: null,
    error: null,
    switchTo: () => {},
    select: () => {},
    connect: () => {},
    authorize: () => {},
    disconnect: () => {},
  },
] as unknown as AuthContextType

const AuthContext = createContext(defaultAuthState)

const useAuthContext = () => {
  return useContext(AuthContext)
}
const AuthProvider = (props: React.PropsWithChildren<AuthProviderProps>) => {
  const { children } = props
  const auth = useAuth()

  // TODO: Remove after all dApps get the user identity from localhost
  // Initialize SSO
  // Will only be initialized if the sso url is provided.
  // If the url is not provided, the identity of the user will be stored in the application's local storage instead of the sso local storage.
  /* useEffect(() => {
    console.log(" > AuthProvider > useEffect > sso > ", sso)
    if (sso && isURL(sso)) {
      SSO.init(sso)
    }
  }, [sso]) */

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export { AuthContext, useAuthContext, AuthProvider }
