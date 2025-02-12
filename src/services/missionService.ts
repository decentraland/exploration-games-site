import API from "decentraland-gatsby/dist/utils/api/API"
import Options from "decentraland-gatsby/dist/utils/api/Options"
import { config } from "../config"
import { Mission, MissionData } from "../types.ts" // You'll need to create this type

const SERVER_URL = config.get("SERVER_URL")
const api = new API(SERVER_URL)

export const missionService = {
  async getAllMissions(): Promise<Mission[]> {
    try {
      const response = (await api.fetch(
        "/api/missions",
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("GET")
      )) as {
        data: Mission[]
      }
      if (!response.data?.length) {
        throw new Error("Failed to fetch missions")
      }
      return response.data
    } catch (error) {
      console.error("Error fetching missions:", error)
      throw error
    }
  },

  async getMissionById(id: string): Promise<MissionData> {
    try {
      const response = (await api.fetch(
        `/api/missions/${id}`,
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("GET")
      )) as {
        data: MissionData
      }

      if (!response.data) {
        throw new Error("Failed to fetch mission")
      }
      return response.data
    } catch (error) {
      console.error("Error fetching mission:", error)
      throw error
    }
  },

  async updateMission(mission: Mission): Promise<void> {
    try {
      await api.fetch(
        `/api/missions/${mission.id}`,
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("PATCH")
          .json({
            description: mission.description,
            campaign_key: mission.campaign_key,
          })
      )
      return
    } catch (error) {
      console.error("Error updating mission:", error)
      throw error
    }
  },
}
