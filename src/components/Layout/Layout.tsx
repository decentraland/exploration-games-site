import { useCallback, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Navbar } from "decentraland-ui2"
import { Menu } from "./Menu"
import { config } from "../../config"
import { useAuthContext } from "../../context/AuthProvider"
import { useAvatar } from "../../hooks/useAvatar"
import { locations } from "../../modules/Locations"
import { LayoutContainer } from "./Layout.styled"

const Layout = () => {
  const [account, accountState] = useAuthContext()
  const [avatar, avatarState] = useAvatar(account)
  const navigate = useNavigate()

  const handleClickBalance = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
    ) => {
      event.preventDefault()

      window.open(config.get("ACCOUNT_URL"), "_blank", "noopener")
    },
    []
  )

  const handleSignOut = useCallback(() => {
    accountState && accountState.disconnect()
  }, [accountState])

  useEffect(() => {
    if (!account) {
      navigate(locations.signIn())
    } else {
      navigate(locations.missions())
    }
  }, [account])

  return (
    <LayoutContainer>
      <Navbar
        address={account || undefined}
        avatar={(avatarState.loaded && avatar) || undefined}
        activePage="governance"
        isSignedIn={!!account}
        isSigningIn={accountState.loading}
        onClickBalance={handleClickBalance}
        onClickSignIn={accountState.authorize}
        onClickSignOut={handleSignOut}
      />
      <Menu />
      <Outlet />
    </LayoutContainer>
  )
}

export { Layout }
