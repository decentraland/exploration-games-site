import { AuthLinkType } from "@dcl/crypto/dist/types"
import * as SSO from "@dcl/single-sign-on-client"
import { isPast } from "date-fns"
import { ownerAddress } from "./identify"
import type { AuthIdentity } from "@dcl/crypto/dist/types"

let CURRENT_IDENTITY: AuthIdentity | null = null
let CURRENT_IDENTITY_RAW: string | null = null

const isExpired = (identity?: AuthIdentity) => {
  if (!identity) {
    return true
  }

  return isPast(identity.expiration)
}

const isValid = (identity?: AuthIdentity) => {
  if (!identity) {
    return false
  }

  const link = identity.authChain.find(
    (link) =>
      link.type === AuthLinkType.ECDSA_PERSONAL_EPHEMERAL ||
      link.type === AuthLinkType.ECDSA_EIP_1654_EPHEMERAL
  )

  if (link && link.signature && typeof link.signature === "string") {
    return true
  }

  return false
}

const setCurrentIdentity = async (identity: AuthIdentity | null) => {
  if (identity === null || isExpired(identity) || !isValid(identity)) {
    CURRENT_IDENTITY = null
    await storeIdentity(null)
    return null
  }

  CURRENT_IDENTITY = identity
  await storeIdentity(identity)
  return identity
}

const getCurrentIdentity = () => {
  return CURRENT_IDENTITY
}

const storeIdentity = async (identity: AuthIdentity | null) => {
  if (typeof localStorage !== "undefined") {
    if (identity) {
      // If an identity is provided, store it in the SSO iframe for the account it belongs to.
      const account = await ownerAddress(identity.authChain)
      await SSO.storeIdentity(account, identity)
      CURRENT_IDENTITY_RAW = JSON.stringify(identity)
    } else {
      CURRENT_IDENTITY_RAW = null
    }
  }
}

// Clears the identity from SSO.
const clearIdentity = async () => {
  if (CURRENT_IDENTITY_RAW) {
    const prevIdentity = JSON.parse(CURRENT_IDENTITY_RAW)
    const account = await ownerAddress(prevIdentity.authChain)
    await SSO.clearIdentity(account)
  }
}

export {
  setCurrentIdentity,
  clearIdentity,
  isExpired,
  isValid,
  getCurrentIdentity,
}
