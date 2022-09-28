import { ArrowBack, Close } from '@material-ui/icons';
import React, {useState, useRef, useEffect, useCallback} from 'react'
import styled from 'styled-components';
import { useChatContext } from '../../providers/ChatProvider';
import { useUserContext } from '../../providers/UserProvider';
import ChatAvatar from '../ChatAvatar';
import ChatBubble from '../ChatBubble';
import { debounce } from 'lodash';

const TYPING_STATE = {
  IDLE: 0,
  TYPING: 1
}

function ActiveChat({input}) {
    const setRef = useCallback(node => {
        if(node){
            node.scrollIntoView({smooth: true});
        }
    }, []);
    const root = useRef(null),
    marker = useRef(null);
    const { user } = useUserContext();
    const { activeChatId, activeChat, removeActiveChat, registerTypingStateCallback, unregisterTypingStateCallback, sendIsTypingState } = useChatContext();

    const [ typingState, setTypingState ] = useState(null);
    const { participants=[], messages=[] } = activeChat;

    console.log('Rendering ActiveChat');

    let friend = null, unreadMessageCount = 0;

    if(activeChat && !activeChat.isGroup){
      friend = participants.find(p => p.id !== user.uid);
      unreadMessageCount = (friend && friend.unreadMessageCount) || 0;
    }

    const callback = debounce(() => {
      console.log('fetch more....');
    }, 500);

    const typingStateCallback = (response) => {
      console.log('typingStateCallback', response);
      if(!typingState || response && response.state !== typingState.state){
        setTypingState(response);
      }
    }

    const onTyping = debounce(() => {
      sendIsTypingState(TYPING_STATE.TYPING);
    }, 600)

    const onIdle = debounce(() => {
      sendIsTypingState(TYPING_STATE.IDLE);
    }, 1000);

    useEffect(() => {
      console.log('Updating active chat', messages);
    }, [activeChat])

    useEffect(() => {
      /* Initiate intersection observer */
      const OPTIONS = {
        root: root.current,
        rootMargin: '10px 0px',
        threshold: 0.1
      }
      const observer = new IntersectionObserver(callback, OPTIONS);
      observer.observe(marker.current);

      return () => {
        if(marker.current){
          observer.unobserve(marker.current);
        }
        
      };
    }, [activeChatId]);

    useEffect(() => {

      if(input) {
        registerTypingStateCallback(typingStateCallback);
        input.addEventListener('keydown', onTyping);
        input.addEventListener('keyup', onIdle);

      }

      return () => {
        unregisterTypingStateCallback();
        if(input){
          input.removeEventListener('keydown', onTyping);
          input.removeEventListener('keyup', onIdle);
        }
      }
    }, [input])
    
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
        <ActiveChatWrapper ref={root}>
          {
            typingState && typingState.state === TYPING_STATE.TYPING && 
            <ChatBubble key={activeChatId} text={`${typingState.displayName.split(' ')[0]} is typing...`} />
          }
          {
            messages.map((m, index) => {
              
              return <ChatBubble {...m} key={m.id} unread={unreadMessageCount-- > 0} />
            })
          }
          <Marker ref={marker}></Marker>
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
`;

const Marker = styled.span`
  height: 8px;
  width: 100%;
  background: transparent;
`

export default ActiveChat