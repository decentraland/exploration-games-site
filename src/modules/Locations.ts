const locations = {
  root: () => "/",
  missions: () => "/missions",
  games: () => "/games",
  challenges: () => "/challenges",
  signIn: (redirectTo?: string) => {
    return `/sign-in${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
  },
}

export { locations }
