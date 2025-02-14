import { ChallengeResponse, GameResponse, MissionRequest } from "../../../types"

type ChallengeListProps = {
  challengesData: ChallengeResponse[]
  gamesData: GameResponse[]
  missionData: MissionRequest
  onUpdate: () => void
}

export type { ChallengeListProps }
