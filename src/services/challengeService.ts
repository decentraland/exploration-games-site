import { config } from "../config"
import { Challenge } from "../types.ts" // You'll need to create this type

const SERVER_URL = config.get("SERVER_URL")
export const challengeService = {
  async getAllChallenges(): Promise<Challenge[]> {
    try {
      const response = await fetch(SERVER_URL + "/api/challenges")
      if (!response.ok) {
        throw new Error("Failed to fetch challenges")
      }
      return (await response.json()).data
    } catch (error) {
      console.error("Error fetching challenges:", error)
      throw error
    }
  },

  async getChallengeById(id: number): Promise<Challenge> {
    try {
      const response = await fetch(`/api/challenges/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch challenge")
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching challenge:", error)
      throw error
    }
  },

  // Add other mission-related API calls here
}
