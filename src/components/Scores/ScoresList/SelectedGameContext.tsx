import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react"

type SelectedGame = {
  gameId: string | null
  gameName: string
  gameParcel: string
}

type SelectedGameContextValue = SelectedGame & {
  selectGame: (gameId: string, gameName: string, gameParcel: string) => void
  clearGame: () => void
}

const INITIAL: SelectedGame = { gameId: null, gameName: "", gameParcel: "" }

const SelectedGameContext = createContext<SelectedGameContextValue>({
  ...INITIAL,
  selectGame: () => {},
  clearGame: () => {},
})

const SelectedGameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<SelectedGame>(INITIAL)

  const selectGame = useCallback(
    (gameId: string, gameName: string, gameParcel: string) =>
      setGame({ gameId, gameName, gameParcel }),
    []
  )

  const clearGame = useCallback(() => setGame(INITIAL), [])

  return (
    <SelectedGameContext.Provider value={{ ...game, selectGame, clearGame }}>
      {children}
    </SelectedGameContext.Provider>
  )
}

const useSelectedGame = () => useContext(SelectedGameContext)

export { SelectedGameProvider, useSelectedGame }
