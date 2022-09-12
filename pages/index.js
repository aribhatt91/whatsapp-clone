import Head from 'next/head';
import styled from 'styled-components';
import ChatBox from '../components/ChatBox';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import ChatProvider from '../providers/ChatProvider';
import NetworkStateProvider from '../providers/NetworkStateProvider';
import SocketProvider from '../providers/SocketProvider';
import UserProvider from '../providers/UserProvider';

export default function Home() {
  return (
    <NetworkStateProvider>
      <UserProvider>
        <SocketProvider>
          
            <AppContainer>
              
              <Head>
                <title>WhatsApp 2.0</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
              </Head>

              <NavBar/>

              <ChatProvider>
                <Container>
                  <SideBar />
                  <ChatBox />
                </Container>
              </ChatProvider>
              
            </AppContainer>
        </SocketProvider>
      </UserProvider>
    </NetworkStateProvider>
  )
}

const AppContainer = styled.main`
  background-color: #ececec;
  min-height: 100vh;
  max-height: 100vh;
`

const Container = styled.div`
  max-width: 1024px;
  margin: auto;
  display: flex;
  width: 100%;
  min-height: calc(100vh - 80px);
  max-height: calc(100vh - 80px);
`
