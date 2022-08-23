import React from 'react';
import styled from 'styled-components';
import { Message } from "@material-ui/icons";

function ChatBox() {
  return (
    <ChatBoxContainer>

        <ChatBoxWrapper>

        </ChatBoxWrapper>

        <ChatInputWrapper>
            <ChatInput></ChatInput>

            <ChatActionButton>
                <Message/>
            </ChatActionButton>

        </ChatInputWrapper>
    </ChatBoxContainer>
  )
}

const ChatBoxContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
    padding: 1rem;
`;

const ChatBoxWrapper = styled.div`
    flex: 1;
    background: #fff;
    border-radius: 24px;
`;

const ChatInputWrapper = styled.div`
    height: 80px;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
`;

const ChatInput = styled.input`
    height: 64px;
    flex: 1;
    background: #fff;
    border-radius: 32px;
    border: none;
    padding: 0 1rem;
    outline: none;
`

const ChatActionButton = styled.button`
    width: 56px;
    height: 56px;
    border: none;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #128c7e;
    border-radius: 56px;
`

export default ChatBox