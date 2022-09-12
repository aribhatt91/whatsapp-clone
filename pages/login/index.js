
import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { auth, signInWithPopup, signOut, provider } from "../../firebase";
import { useUserContext } from "../../providers/UserProvider";

function Login() {
  const {signIn} = useUserContext(); // () => signInWithPopup(auth, provider).catch(error => console.error(error));

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo src="https://static.whatsapp.net/rsrc.php/ym/r/36B424nhiL4.svg"></Logo>
        <GoogleSignInButton onClick={signIn}><span>Sign in with Google</span></GoogleSignInButton>
      </LoginContainer>
    </Container>
  )
}

export default Login;

const Container = styled.div`
  background-color: #128c7e;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width 100%;
  height: auto;
  max-width: 100%;
  padding: 40px;

  @media(min-width: 768px) {
    width 400px;
  }
`

const GoogleSignInButton = styled(Button).attrs(props => {
  variant: 'light'
})`
  background: #fff !important;
  padding: 0.5rem 1.5rem !important;
  border-radius: 40px !important;
  &:hover {
    background: rgba(255, 255, 255, 0.7) !important;
  }
`