import API from "decentraland-gatsby/dist/utils/api/API"
import Options from "decentraland-gatsby/dist/utils/api/Options"
import { config } from "../config"
import { ChallengeRequest } from "../types"

const SERVER_URL = config.get("SERVER_URL")
const api = new API(SERVER_URL)

export const challengeApi = {
  async updateChallenge(
    id: string,
    challenge: ChallengeRequest
  ): Promise<void> {
    try {
      await api.fetch(
        `/api/challenges/${id}`,
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("PATCH")
          .json(challenge)
      )
      return
    } catch (error) {
      console.error("Error updating challenge:", error)
      throw error
    }
  },
  async createChallenge(challenge: ChallengeRequest): Promise<void> {
    try {
      await api.fetch(
        `/api/challenges`,
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("POST")
          .json(challenge)
      )
      return
    } catch (error) {
      console.error("Error creating challenge:", error)
      throw error
    }
  },
}
