import API from "decentraland-gatsby/dist/utils/api/API"
import Options from "decentraland-gatsby/dist/utils/api/Options"
import { config } from "../config"
import {
  Leaderboard,
  ProgressSort,
  ProgressStatusBody,
  UserProgress,
} from "../types"

const SERVER_URL = config.get("SERVER_URL")
const api = new API(SERVER_URL)

type GetAllProgressParams = {
  limit?: number
  page?: number
  sort?: ProgressSort
  direction?: "ASC" | "DESC"
  level?: number
}

type GetLeaderboardParams = {
  limit?: number
  sort?: Exclude<ProgressSort, ProgressSort.LEVEL>
  direction?: "ASC" | "DESC"
  level?: number
}

type RawLeaderboardItem = Partial<{
  user_name: string
  name: string
  user_address: string
  score: number | string
  time: number | string
  moves: number | string
  level: number | string
  data: Record<string, unknown>
}>

const toNumber = (value: number | string | undefined): number => {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export const scoresApi = {
  async getAllProgressInGame(
    gameId: string,
    params: GetAllProgressParams = {}
  ): Promise<{ data: UserProgress[] }> {
    try {
      const queryParams = new URLSearchParams()
      if (params.limit !== undefined)
        queryParams.set("limit", String(params.limit))
      if (params.page !== undefined)
        queryParams.set("page", String(params.page))
      if (params.sort) queryParams.set("sort", params.sort)
      if (params.direction) queryParams.set("direction", params.direction)
      if (params.level !== undefined)
        queryParams.set("level", String(params.level))

      const qs = queryParams.toString()
      const url = `/api/games/${gameId}/progress/all${qs ? `?${qs}` : ""}`

      const response = (await api.fetch(
        url,
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("GET")
      )) as { data: UserProgress[] }

      if (!response.data) {
        throw new Error("Fetching progress: no data")
      }
      return response
    } catch (error) {
      console.error("Error fetching progress:", error)
      throw error
    }
  },

  async setProgressStatus({
    ids,
    disabled,
  }: ProgressStatusBody): Promise<unknown> {
    try {
      const response = await api.fetch(
        `/api/games/progress/status`,
        new Options()
          .authorization({ sign: true })
          .metadata({ signer: "decentraland-kernel-scene" })
          .method("PATCH")
          .json({ ids, disabled })
      )
      return response
    } catch (error) {
      console.error("Error setting progress status:", error)
      throw error
    }
  },

  async getLeaderboard(
    gameId: string,
    params: GetLeaderboardParams = {}
  ): Promise<{ data: Leaderboard[] }> {
    try {
      const queryParams = new URLSearchParams()
      if (params.limit !== undefined)
        queryParams.set("limit", String(params.limit))
      if (params.sort) queryParams.set("sort", String(params.sort))
      if (params.direction) queryParams.set("direction", params.direction)
      if (params.level !== undefined)
        queryParams.set("level", String(params.level))

      const qs = queryParams.toString()
      const url = `/api/games/${gameId}/leaderboard${qs ? `?${qs}` : ""}`

      const response = (await api.fetch(url, new Options().method("GET"))) as {
        data?: RawLeaderboardItem[]
      }

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Fetching leaderboard: no data")
      }

      const normalizedData: Leaderboard[] = response.data.map((row) => ({
        user_name: row.user_name ?? row.name ?? "",
        user_address: row.user_address ?? "",
        score: toNumber(row.score),
        time: toNumber(row.time),
        moves: toNumber(row.moves),
        level: toNumber(row.level),
        data: row.data ?? {},
      }))

      return { data: normalizedData }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      throw error
    }
  },
}
