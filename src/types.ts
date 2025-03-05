type MissionRequest = {
  id: string
  description: string
  campaign_key: string
  type: MissionType
  // active: boolean
}

enum MissionType {
  MINI_GAMES = "mini-games",
  FASHION_WEEK = "fw-2025",
}

type MissionData = {
  mission: MissionRequest
  challenges: ChallengeResponse[]
  games: GameResponse[]
}

type ChallengeRequest = {
  description: string
  gameId: string
  missionId: string
  targetLevel: number
  data?: Record<string, unknown>
  // active: boolean
}

type ChallengeResponse = {
  id: string
  description: string
  game_id: string
  mission_id: string
  target_level: number
  data?: Record<string, unknown>
  // active: boolean
}

type GameResponse = {
  id: string
  name: string
  parcel: string
  // active: boolean
}

type GameRequest = {
  name: string
  x: number
  y: number
}

export type {
  MissionRequest,
  ChallengeRequest,
  GameRequest,
  GameResponse,
  MissionData,
  ChallengeResponse,
}

export { MissionType }
