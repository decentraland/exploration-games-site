import { ProgressSort } from "../types"

type LeaderboardConfig = {
  showScore?: boolean
  showTime?: boolean
  showMoves?: boolean
  showLevel?: boolean
  sortField: Exclude<ProgressSort, ProgressSort.LEVEL>
  sortDirection: "ASC" | "DESC"
}

/**
 * Games that have leaderboard support enabled.
 * Only games listed here will show the LeaderboardPreview panel in the Scores tab.
 * Add an entry using the game's ID as the key.
 *
 * Example:
 *   "my-game-id": { showScore: true, showTime: true, showMoves: true, showLevel: false },
 */
const colorPopLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: true,
  showMoves: false,
  showLevel: false,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const mosaicManiaLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: true,
  showMoves: false,
  showLevel: true,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const towersOfHanoiLeaderboardConfig: LeaderboardConfig = {
  showScore: false,
  showTime: true,
  showMoves: true,
  showLevel: true,
  sortField: ProgressSort.TIME,
  sortDirection: "ASC",
}

const tileTallyLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: true,
  showMoves: false,
  showLevel: false,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const recallRushLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: true,
  showMoves: false,
  showLevel: false,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const minesweeperLeaderboardConfig: LeaderboardConfig = {
  showScore: false,
  showTime: true,
  showMoves: false,
  showLevel: true,
  sortField: ProgressSort.TIME,
  sortDirection: "ASC",
}

const wordSearchLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: false,
  showMoves: false,
  showLevel: true,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const liquidLabyrinthLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: false,
  showMoves: false,
  showLevel: true,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const saladSlashLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: true,
  showMoves: false,
  showLevel: false,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const memoryGridLeaderboardConfig: LeaderboardConfig = {
  showScore: false,
  showTime: true,
  showMoves: false,
  showLevel: true,
  sortField: ProgressSort.TIME,
  sortDirection: "ASC",
}

const carParkPuzzleLeaderboardConfig: LeaderboardConfig = {
  showScore: false,
  showTime: true,
  showMoves: true,
  showLevel: true,
  sortField: ProgressSort.MOVES,
  sortDirection: "ASC",
}

const chemicalClashLeaderboardConfig: LeaderboardConfig = {
  showScore: false,
  showTime: true,
  showMoves: true,
  showLevel: true,
  sortField: ProgressSort.TIME,
  sortDirection: "ASC",
}

const memoryCircusLeaderboardConfig: LeaderboardConfig = {
  showScore: false,
  showTime: true,
  showMoves: true,
  showLevel: true,
  sortField: ProgressSort.MOVES,
  sortDirection: "ASC",
}

const mathKittensLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: false,
  showMoves: false,
  showLevel: true,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const slidingPuzzleLeaderboardConfig: LeaderboardConfig = {
  showScore: false,
  showTime: true,
  showMoves: false,
  showLevel: true,
  sortField: ProgressSort.TIME,
  sortDirection: "DESC",
}

const pixelSnakeLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: false,
  showMoves: false,
  showLevel: false,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const gearsAndGlitchesLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: true,
  showMoves: false,
  showLevel: false,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const whackAFrogLeaderboardConfig: LeaderboardConfig = {
  showScore: true,
  showTime: false,
  showMoves: false,
  showLevel: false,
  sortField: ProgressSort.SCORE,
  sortDirection: "DESC",
}

const leaderboardConfig: Record<string, LeaderboardConfig> = {
  // color pop
  "059739aa-376f-4bcd-adc5-4081d808bc9a": colorPopLeaderboardConfig,
  "59f9a5b0-6ea1-454e-9682-d63cd26e7d38": colorPopLeaderboardConfig,
  "dac09eb1-f833-41c3-a65c-b8b9ddfb8e21": colorPopLeaderboardConfig,
  // mosaic mania
  "5900fefd-c511-4d29-b749-0146d4e6839d": mosaicManiaLeaderboardConfig,
  "88af3bb3-dec4-42bf-ad46-1da9e6b6abb5": mosaicManiaLeaderboardConfig,
  "c124e947-34f9-4ee0-adf6-eda4fd0e3fb1": mosaicManiaLeaderboardConfig,
  // towers of hanoi
  "4ee1d308-5e1e-4b2b-9e91-9091878a7e3d": towersOfHanoiLeaderboardConfig,
  "56a715d6-992e-4beb-9648-2f82fc7fa351": towersOfHanoiLeaderboardConfig,
  // tile tally
  "0e15a408-6d3a-42ab-9873-0dc0a00535cc": tileTallyLeaderboardConfig,
  "1de7bb10-02b8-4f15-be3d-6bce539b45f7": tileTallyLeaderboardConfig,
  "88bb9158-e636-4886-8e2f-4839fb68f12f": tileTallyLeaderboardConfig,
  "4100b0e0-35a7-4f11-8a9a-c699140d31bd": tileTallyLeaderboardConfig,
  // recall rush
  "74eed170-ee82-4d18-9139-d0721b994aa9": recallRushLeaderboardConfig,
  "c1ce404b-7a82-40f3-96b7-60a307866432": recallRushLeaderboardConfig,
  // minesweeper
  "00c03b95-6948-48d7-acf2-94f447f7d992": minesweeperLeaderboardConfig,
  "f2a5e081-3b5e-4122-9ad1-8a8272c503b5": minesweeperLeaderboardConfig,
  "2a3ba694-ae7e-462b-80be-da5ec4fc166d": minesweeperLeaderboardConfig,
  "8e0ff2bf-599e-4334-8a0a-248e768b3bd5": minesweeperLeaderboardConfig,
  // word search
  "87b372f7-0653-4405-b43d-1f9c2f6c20ed": wordSearchLeaderboardConfig,
  "35affe10-974e-49cc-8ada-0d9184104b4a": wordSearchLeaderboardConfig,
  "08f80501-1fa6-4881-beec-35f4f38ee366": wordSearchLeaderboardConfig,
  "f8f695c8-739f-4fa0-a077-9556c11ce36d": wordSearchLeaderboardConfig,
  // liquid labyrinth
  "a53644bc-12c0-47d3-a04a-4ef7226e2ec8": liquidLabyrinthLeaderboardConfig,
  "46d0f6a4-3991-415c-8cfc-fe32419e5731": liquidLabyrinthLeaderboardConfig,
  // salad slash
  "99c87644-2111-4a1d-b6cd-572f879f1429": saladSlashLeaderboardConfig,
  "234f9f0b-1c9a-4a37-9657-cffce7d73da4": saladSlashLeaderboardConfig,
  "22bf0ddd-84d2-41a1-9738-c640f4f8021c": saladSlashLeaderboardConfig,
  // memory grid
  "5728b531-4760-4647-a843-d164283dae6d": memoryGridLeaderboardConfig,
  "a40519cd-9070-426b-9d17-ae49eb8c7e5e": memoryGridLeaderboardConfig,
  // car park puzzle
  "67ad1757-6796-4817-ac29-5bf1987d24f9": carParkPuzzleLeaderboardConfig,
  "86ea9cd5-cadf-46b5-bd9e-f6d7abafbfa0": carParkPuzzleLeaderboardConfig,
  // chemical clash
  "e5ec213a-628f-4ef7-8f6f-0cb543da0701": chemicalClashLeaderboardConfig,
  "cc9bc8da-5026-4458-8b59-3933c7e2c94b": chemicalClashLeaderboardConfig,
  "fe6deed7-278d-4837-bc43-f7e8ac45b802": chemicalClashLeaderboardConfig,
  "e6ba3dcc-5f97-4b82-ba3f-f46ce0c082fc": chemicalClashLeaderboardConfig,
  // memory circus
  "e05b3729-9504-40e9-8a49-c2145e568d62": memoryCircusLeaderboardConfig,
  "c6f89d70-497f-4006-928e-0a155db279e1": memoryCircusLeaderboardConfig,
  // math kittens
  "040ff183-c10a-4fba-8800-881cf9bda930": mathKittensLeaderboardConfig,
  "6426a500-4320-4c4b-9bda-1b8210e6ed0d": mathKittensLeaderboardConfig,
  // sliding puzzle
  "001c138f-e6e4-4a79-812e-406e2219f464": slidingPuzzleLeaderboardConfig,
  "54a93451-bdda-4db5-9eb8-e7417c226f59": slidingPuzzleLeaderboardConfig,
  // pixel snake
  "607f24d8-fb0c-4518-9cc4-9529ba924792": pixelSnakeLeaderboardConfig,
  "9c7cb318-0b22-4eee-aba6-3c76e565b341": pixelSnakeLeaderboardConfig,
  "0f609373-2ff9-494d-9eda-cbfe83d411c3": pixelSnakeLeaderboardConfig,
  // gears & glitches
  "2299ece9-d14d-4b2a-8cf8-08b8b1b6231b": gearsAndGlitchesLeaderboardConfig,
  "e2f40a27-28f3-44b2-8e5a-d6673127f897": gearsAndGlitchesLeaderboardConfig,
  // whack-a-frog
  "5e68058a-2f02-4c51-9e22-198070bbcdcf": whackAFrogLeaderboardConfig,
  "595dd329-d77f-45fc-bcfa-81fca24892b1": whackAFrogLeaderboardConfig,
}

export { leaderboardConfig }
export type { LeaderboardConfig }
