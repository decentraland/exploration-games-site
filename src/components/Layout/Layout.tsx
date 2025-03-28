import { useCallback, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Avatar } from "@dcl/schemas/dist/platform/profile/avatar"
import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import useProfileContext from "decentraland-gatsby/dist/context/Auth/useProfileContext"
import { Navbar } from "decentraland-ui2"
import { Menu } from "./Menu"
import { config } from "../../config"
import { locations } from "../../modules/Locations"
import { LayoutContainer } from "./Layout.styled"

const Layout = () => {
  const [account, accountState] = useAuthContext()
  const [avatar, avatarState] = useProfileContext()
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
        avatar={(avatarState.loaded && (avatar as Avatar)) || undefined}
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
