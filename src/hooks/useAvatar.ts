import { Avatar } from "@dcl/schemas"
import { useAsyncState } from "./useAsyncState"
import { config } from "../config"

const DEFAULT_AVATAR =
  "https://peer.decentraland.org/content/contents/default_avatar.png"

const createDefaultAvatar = (address: string): Avatar => ({
  userId: address,
  name: "",
  description: "",
  ethAddress: address,
  version: 0,
  tutorialStep: 0,
  hasClaimedName: false,
  avatar: {
    snapshots: {
      body: "",
      face256: DEFAULT_AVATAR,
    },
    bodyShape: "dcl://base-avatars/BaseMale",
    eyes: {
      color: {
        r: 0.125,
        g: 0.703125,
        b: 0.96484375,
      },
    },
    hair: {
      color: {
        r: 0.234375,
        g: 0.12890625,
        b: 0.04296875,
      },
    },
    skin: {
      color: {
        r: 0.94921875,
        g: 0.76171875,
        b: 0.6484375,
      },
    },
    wearables: [
      "dcl://base-avatars/green_hoodie",
      "dcl://base-avatars/brown_pants",
      "dcl://base-avatars/sneakers",
      "dcl://base-avatars/casual_hair_01",
      "dcl://base-avatars/beard",
    ],
  },
  hasConnectedWeb3: false,
})

const fetchAvatar = async (address: string): Promise<Avatar> => {
  try {
    const URL_CATALYST = config.get("URL_CATALYST")
    const response = await fetch(
      `${URL_CATALYST}/lambdas/profile/${address.toLowerCase()}`
    )
    if (!response.ok) {
      throw new Error("Error fetching avatar")
    }
    const data = await response.json()
    return data.avatars?.[0] || createDefaultAvatar(address)
  } catch (error) {
    console.error("Error fetching avatar:", error)
    return createDefaultAvatar(address)
  }
}

const useAvatar = (address?: string | null) => {
  return useAsyncState(
    async () => {
      if (!address) {
        return createDefaultAvatar("")
      }
      return fetchAvatar(address)
    },
    [address],
    {
      initialValue: createDefaultAvatar(""),
    }
  )
}

export { useAvatar }
