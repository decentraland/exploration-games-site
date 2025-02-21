import { ChallengeResponse, GameResponse, MissionRequest } from "../../../types"

type ChallengeListProps = {
  challenges: ChallengeResponse[]
  games: GameResponse[]
  mission: MissionRequest
  onUpdate?: () => void
}

export type { ChallengeListProps }
