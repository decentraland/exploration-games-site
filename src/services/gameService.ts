import API from "decentraland-gatsby/dist/utils/api/API"
import Options from "decentraland-gatsby/dist/utils/api/Options"
import { config } from "../config"
import { GameRequest, GameResponse } from "../types"

const SERVER_URL = config.get("SERVER_URL")
const api = new API(SERVER_URL)

export const gameService = {
  async getAllGames(): Promise<GameResponse[]> {
    try {
      const response = (await api.fetch(
        "/api/games",
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("GET")
      )) as {
        data: GameResponse[]
      }
      if (!response.data) {
        throw new Error("Failed to fetch games")
      }
      return response.data
    } catch (error) {
      console.error("Error fetching games:", error)
      throw error
    }
  },

  async getGameById(id: number): Promise<GameResponse> {
    try {
      const response = (await api.fetch(
        `/api/games/${id}`,
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("GET")
      )) as {
        data: GameResponse
      }

      if (!response.data) {
        throw new Error("Failed to fetch game")
      }
      return response.data
    } catch (error) {
      console.error("Error fetching game:", error)
      throw error
    }
  },

  async updateGame(id: string, gameData: GameRequest): Promise<void> {
    try {
      await api.fetch(
        `/api/games/${id}`,
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("PATCH")
          .json(gameData)
      )
      return
    } catch (error) {
      console.error("Error updating game:", error)
      throw error
    }
  },
}
