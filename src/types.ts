type Mission = {
  id: string
  description: string
  campaign_key: string
  // active: boolean
}

type MissionData = {
  mission: Mission
  challenges: ChallengeResponse[]
  games: Game[]
}

type Challenge = {
  id: string
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

type Game = {
  id: string
  name: string
  parcel: string
  // active: boolean
}

export type { Mission, Challenge, Game, MissionData }
