
import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from "styled-components";
import { useUserContext } from "../../providers/UserProvider";

function Login() {
  const {signIn} = useUserContext();

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo src="https://static.whatsapp.net/rsrc.php/ym/r/36B424nhiL4.svg"></Logo>
        <Button onClick={signIn} variant="light">Sign in with Google</Button>
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