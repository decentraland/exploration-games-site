import { ChallengeResponse } from "../../../types"

type ChallengeEditorProps = {
  challengeData: ChallengeEditorDataProps | null
  onUpdate?: () => void
}

type ChallengeEditorDataProps = ChallengeResponse & {
  missionName?: string
  gameName?: string
}

export type { ChallengeEditorProps, ChallengeEditorDataProps }
