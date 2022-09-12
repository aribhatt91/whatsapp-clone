import styled from "styled-components";
import { useUserContext } from "../../providers/UserProvider";
/* 
message: {
    timestamp,
    text
}
*/
const ChatBubble = ({text, senderId, seen, delivered, timestamp}) => {
    const {user} = useUserContext();
    return (
        <ChatBubbleContainer self={senderId === user.uid}>
            <p>
                {text}
            </p>
        </ChatBubbleContainer>
    );
}

export default ChatBubble;

const ChatBubbleContainer = styled.div`
    justify-content: ${props => props.self ? 'flex-end' : 'flex-start'};
    display: flex;
    width: 100%;

    > p {
        background-color: ${props => props.self ? '#128c7e' : '#ececec'};
        color: ${props => props.self ? '#fff' : '#333'};
        textAlign: ${props => props.self ? 'right' : 'left'};
        display: inline-block;
        max-width: 75%;
        width: auto;
        margin: 0.25rem;
        border-radius: 0.5rem;
        border-bottom-left-radius: ${props => props.self ? '0.5rem' : 0};
        border-bottom-right-radius: ${props => props.self ? 0 : '0.5rem'};
        font-size: 0.875rem;
        padding: 0.5rem 1rem;
    }
`