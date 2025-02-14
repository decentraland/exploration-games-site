import { ChallengeResponse } from "../../../types"

type ChallengeEditorProps = {
  challengeData: ChallengeEditorData | null
  onUpdate?: () => void
}

type ChallengeEditorData = ChallengeResponse & {
  missionName?: string
  gameName?: string
}

export type { ChallengeEditorProps, ChallengeEditorData }
