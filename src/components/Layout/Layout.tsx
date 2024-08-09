import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Navbar } from "./Navbar"
import { useAuthContext } from "../../context/AuthProvider"
import { locations } from "../../modules/Locations"

const Layout = () => {
  const [account] = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!account) {
      navigate(locations.signIn())
    } else {
      navigate(locations.missions())
    }
  }, [account])

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export { Layout }
