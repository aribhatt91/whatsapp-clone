import React, { useRef } from 'react';
import styled from 'styled-components';
import { Message, Send } from "@material-ui/icons";
import { useChatContext } from '../../providers/ChatProvider';
import ActiveChat from '../ActiveChat';

function ChatBox() {
    const { activeChat, removeActiveChat, sendMessage } = useChatContext();
    const messageBox = useRef(null);

    const _sendMessage = (e) => {
        e.preventDefault();
        if(messageBox.current) {
            const text = messageBox.current.value;
            sendMessage(text);
            messageBox.current.value = '';
        }
    }

    return (
        <ChatBoxContainer>

            <ChatBoxWrapper>
                {
                    activeChat && <ActiveChat />
                }
            </ChatBoxWrapper>

            <ChatInputWrapper>
                <ChatInput ref={messageBox}></ChatInput>

                <ChatActionButton disabled={!activeChat} onClick={_sendMessage}>
                    <Send/>
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
    max-height: 100%;
    overflow: hidden;
`;

const ChatBoxWrapper = styled.div`
    flex: 1;
    background: #fff;
    border-radius: 24px;
    max-height: calc(100% - 1rem - 64px);
    height: calc(100% - 1rem - 64px);
`;

const ChatInputWrapper = styled.form`
    height: 64px;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
`;

const ChatInput = styled.input.attrs(({disabled}) => {
    type: 'textarea'
})`
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

    &[disabled] {
        pointer-events: none;
        opacity: 0.5
    }
`

export default ChatBox