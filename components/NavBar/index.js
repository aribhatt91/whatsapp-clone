import React from 'react'
import styled from 'styled-components'
import { Avatar, Button, IconButton } from "@material-ui/core";
import { Chat, MoreVert } from "@material-ui/icons";
import { useUserContext } from "../../providers/UserProvider";


function NavBar() {
    const {user} = useUserContext();
  return (
    <NavContainer>
        <Header>
            <UserAvatar user={user} />
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
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    ${({user}) => user && user.photoURL && (
        styled.div`
            background-image: url(${user.photoURL});
            background-repeat: none;
            background-position: center;
            background-size: cover;
            > svg {
                display: none;
            }
        `
    )}
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;


export default NavBar;