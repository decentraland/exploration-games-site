import { ChainId } from "@dcl/schemas/dist/dapps/chain-id"
import { ProviderType } from "@dcl/schemas/dist/dapps/provider-type"
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { Provider } from "decentraland-connect"
import type { AuthIdentity } from "@dcl/crypto/dist/types"

enum AuthEvent {
  Connect = "Connect",
  Connected = "Connected",
  Disconnected = "Disconnected",
}

enum AuthStatus {
  Restoring,
  Disconnected,
  Connected,
  Connecting,
  Disconnecting,
}

type AuthState = {
  selecting: boolean
  account: string | null
  identity: AuthIdentity | null
  provider: Provider | null
  providerType: ProviderType | null
  chainId: ChainId | null
  error: string | null
  status: AuthStatus
}

export type { AuthState }
export { AuthEvent, AuthStatus }
