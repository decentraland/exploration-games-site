type MissionRequest = {
  id: string
  description: string
  campaign_key: string
  type: MissionType
  thumb_url: string
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

type GameMetrics = {
  score: number
  time: number
  moves: number
  level: number
}

type UserProgress = GameMetrics & {
  id: string
  game_id: string
  user_address: string
  user_name: string
  data: Record<string, unknown>
  disabled?: boolean
}

type Leaderboard = GameMetrics & {
  user_name: string
  user_address: string
  data: Record<string, unknown>
}

type ProgressStatusBody = {
  ids: string[]
  disabled: boolean
}

enum ProgressSort {
  SCORE = "score",
  LATEST = "updated_at",
  LEVEL = "level",
  MOVES = "moves",
  TIME = "time",
}

export type {
  MissionRequest,
  ChallengeRequest,
  GameRequest,
  GameResponse,
  MissionData,
  ChallengeResponse,
  GameMetrics,
  UserProgress,
  Leaderboard,
  ProgressStatusBody,
}

export { MissionType, ProgressSort }
