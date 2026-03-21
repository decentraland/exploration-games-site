const locations = {
  root: () => "/",
  missions: () => "/missions",
  games: () => "/games",
  scores: () => "/scores",
  signIn: (redirectTo?: string) => {
    return `/sign-in${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
  },
}

export { locations }
