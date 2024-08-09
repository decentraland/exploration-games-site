import { Authenticator } from "@dcl/crypto"
import type { AuthChain, AuthIdentity } from "@dcl/crypto/dist/types"

const ownerAddress = async (authChain: AuthChain) => {
  return Authenticator.ownerAddress(authChain).toLowerCase()
}

const signPayload = async (identity: AuthIdentity, payload: string) => {
  return Authenticator.signPayload(identity, payload)
}

export { ownerAddress, signPayload }
