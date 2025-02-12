type Mission = {
  id: string
  description: string
  campaign_key: string
  // active: boolean
}

type MissionData = {
  mission: Mission
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
  Mission,
  ChallengeRequest,
  GameRequest,
  GameResponse,
  MissionData,
  ChallengeResponse,
}
