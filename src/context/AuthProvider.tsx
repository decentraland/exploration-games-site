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

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export { AuthContext, useAuthContext, AuthProvider }
