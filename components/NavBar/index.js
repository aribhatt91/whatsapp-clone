import React from 'react'
import styled from 'styled-components'
import { Avatar, Button, IconButton } from "@material-ui/core";
import { Chat, MoreVert } from "@material-ui/icons";
import { useUserContext } from "../../providers/UserProvider";
import ChatAvatar from '../ChatAvatar';


function NavBar() {
    const {user} = useUserContext();
  return (
    <NavContainer>
        <Header>
            <ChatAvatar photoURL={user.photoURL} />
            <UserName></UserName>
            <IconsContainer>
                {/* <IconButton>
                    <Chat/>
                </IconButton> */}
                <IconButton>
                    <MoreVert />
                </IconButton>
                
            </IconsContainer>
        </Header>
    </NavContainer>
  )
}

const UserName = styled.div``;

const NavContainer = styled.nav`
    display: flex;
    height: 80px;
    background-color: #128c7e;
    color: #fff;
`;

const Header = styled.header`
    display: flex;
    width: 100%;
    max-width: 980px;
    margin: auto;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    height: 80px;
    color: #fff;
`;

const IconsContainer = styled.div`
    color: #fff;
    svg {
        fill: #fff;
    }
`;


export default NavBar;