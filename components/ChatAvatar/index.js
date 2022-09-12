import styled from 'styled-components';
import { Avatar } from "@material-ui/core";

export default function ChatAvatar({photoURL, size=56}) {
  return (
    <ChatAvatarStyled datasrc={photoURL}></ChatAvatarStyled>
  )
}

const ChatAvatarStyled = styled(Avatar).attrs(props => {
            
    })`
    background-image: url(${props => props.datasrc || ""});
    background-position: center;
    background-size: cover;
    cursor: pointer;
    width: ${props => props.size}px;
    height: ${props => props.size}px;

    > svg {
        display: ${props => props.datasrc ? 'none' : 'inline-flex'};
    }

    :hover {
        opacity: 0.8;
    }
`;