import { GameResponse } from "../../../types"

interface GameEditorProps {
  gameData?: GameResponse | null
  onUpdate?: () => void
}

export type { GameEditorProps }
