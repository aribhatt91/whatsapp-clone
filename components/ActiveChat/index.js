import { ArrowBack, Close } from '@material-ui/icons';
import React, {useState, useRef, useEffect, useCallback} from 'react'
import styled from 'styled-components';
import { useChatContext } from '../../providers/ChatProvider';
import { useUserContext } from '../../providers/UserProvider';
import ChatAvatar from '../ChatAvatar';
import MESSAGES from '../../lib/mock/messages.json';
import ChatBubble from '../ChatBubble';

function ActiveChat() {
    const setRef = useCallback(node => {
        if(node){
            node.scrollIntoView({smooth: true});
        }
    }, [])
    const { user } = useUserContext();
    const { activeChat, removeActiveChat } = useChatContext();
    const { participants=[] } = activeChat;
    const {messages=[]} = activeChat;

    let friend = null, unreadMessageCount = 0;

    if(activeChat && !activeChat.isGroup){
      friend = participants.find(p => p.id !== user.uid);
      unreadMessageCount = (friend && friend.unreadMessageCount) || 0;
    }
    
    return (
      <ActiveChatStyled>
        {activeChat && <ActiveChatHeader>
            <BackButton onClick={removeActiveChat}>
              <ArrowBack />
            </BackButton>
            <ChatAvatar size={48} photoURL={activeChat.roomAvatar} />
            <DisplayName>
              {
                activeChat.roomName
              }
            </DisplayName>
            <CloseButton onClick={removeActiveChat}>
              <Close />
            </CloseButton>
        </ActiveChatHeader>}
        <ActiveChatWrapper>
          {
            messages.map((m, index) => {
              
              return <ChatBubble {...m} key={m.id} unread={unreadMessageCount-- > 0} />
            })
          }
        </ActiveChatWrapper>
        
      </ActiveChatStyled>
    )
}

const ActiveChatStyled = styled.section`
  display: flex;
  flex-grow: 1;
  height: 100%;
  padding-top: 4rem;
  position: relative;
`

const ActiveChatHeader = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  border-bottom: 2px solid #eee;
  display: flex;
  align-items: center;
  padding: 1rem 1rem;
`

const DisplayName = styled.h5`
  flex-grow: 1;
  margin: 0 1rem;
`

const CloseButton = styled.span`
  display: inline-flex;
  cursor: pointer;

  @media (max-width: 768px) {
    display: none;
  }
`

const BackButton = styled.span`
  margin-right: 1rem;
  display: inline-flex;
  cursor: pointer;

  @media (min-width: 769px) {
    display: none;
  }
`

const ActiveChatWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
  height: 100%;
  padding: 1rem;
  overflow: auto;
`

export default ActiveChat