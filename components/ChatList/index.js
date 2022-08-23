import styled from "styled-components";

const ChatList = ({onNewChat}) => {
    return (
        <ChatListContainer>
            <ChatListHeader>
                <h3>Chats</h3>
                <AddChatButton onClick={onNewChat}>+</AddChatButton>
            </ChatListHeader>
            
            
        </ChatListContainer>
    );
}

const ChatListContainer = styled.div`
    background-color: #fff;
    flex: 1;
    height: 100%;
    border-radius: 24px;
`;

const ChatListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
`

const AddChatButton = styled.button`
    background: transparent;
    border: none;
    border-radius: 24px;
    height: 24px;
    width: 24px;
    outline: none;
    font-size: 2rem;
    line-height: 1;
    transition: 0.2s all;
    cursor: pointer;

    ::hover {
        background: rgba(0, 0, 0, 0.3);
    }
`

export default ChatList;