import { config } from "../config"
import { Mission, MissionData } from "../types.ts" // You'll need to create this type

const SERVER_URL = config.get("SERVER_URL")
export const missionService = {
  async getAllMissions(): Promise<Mission[]> {
    try {
      const response = await fetch(SERVER_URL + "/api/missions")
      if (!response.ok) {
        throw new Error("Failed to fetch missions")
      }
      return (await response.json()).data
    } catch (error) {
      console.error("Error fetching missions:", error)
      throw error
    }
  },

  async getMissionById(id: string): Promise<MissionData> {
    try {
      const response = await fetch(SERVER_URL + `/api/missions/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch mission")
      }
      return (await response.json()).data
    } catch (error) {
      console.error("Error fetching mission:", error)
      throw error
    }
  },

  // Add other mission-related API calls here
}
