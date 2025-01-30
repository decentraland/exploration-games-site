import * as SSO from "@dcl/single-sign-on-client"
import { ownerAddress } from "./identify"
import type { AuthIdentity } from "@dcl/crypto/dist/types"

let CURRENT_IDENTITY: AuthIdentity | null = null
let SET_IDENTITY_FN: ((identity: AuthIdentity | null) => void) | null = null

const getCurrentIdentity = () => {
  return CURRENT_IDENTITY
}

const setIdentityFn = (fn: (identity: AuthIdentity | null) => void) => {
  SET_IDENTITY_FN = fn
}

const setCurrentIdentity = async (identity: AuthIdentity | null) => {
  CURRENT_IDENTITY = identity
  SET_IDENTITY_FN?.(identity)
  await storeIdentity(identity)
  return identity
}

const storeIdentity = async (identity: AuthIdentity | null) => {
  if (typeof localStorage !== "undefined" && identity) {
    const account = await ownerAddress(identity.authChain)
    await SSO.storeIdentity(account, identity)
  }
}

const clearIdentity = async () => {
  if (CURRENT_IDENTITY) {
    const account = await ownerAddress(CURRENT_IDENTITY.authChain)
    await SSO.clearIdentity(account)
  }
  CURRENT_IDENTITY = null
  SET_IDENTITY_FN?.(null)
}

export { setCurrentIdentity, clearIdentity, getCurrentIdentity, setIdentityFn }
