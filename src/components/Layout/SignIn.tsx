import useAuthContext from "decentraland-gatsby/dist/context/Auth/useAuthContext"
import { Button, Typography } from "decentraland-ui2"
import { SignInContainer } from "./SignIn.styled"

const SignIn = () => {
  const [, accountState] = useAuthContext()

  return (
    <SignInContainer>
      <Typography variant="body1">
        You need to{" "}
        <Button variant="text" onClick={accountState.authorize}>
          Sign In
        </Button>{" "}
        to access this page.
      </Typography>
    </SignInContainer>
  )
}

export { SignIn }
