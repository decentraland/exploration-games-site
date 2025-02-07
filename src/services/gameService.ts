import { config } from "../config"
import { Game } from "../types.ts" // You'll need to create this type

const SERVER_URL = config.get("SERVER_URL")
export const gameService = {
  async getAllGames(): Promise<Game[]> {
    try {
      const response = await fetch(SERVER_URL + "/api/games")
      if (!response.ok) {
        throw new Error("Failed to fetch games")
      }
      return (await response.json()).data
    } catch (error) {
      console.error("Error fetching games:", error)
      throw error
    }
  },

  async getGameById(id: number): Promise<Game> {
    try {
      const response = await fetch(`/api/games/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch game")
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching game:", error)
      throw error
    }
  },

  // Add other mission-related API calls here
}
