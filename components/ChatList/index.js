import { Add, GroupAdd } from "@material-ui/icons";
import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useChatContext } from "../../providers/ChatProvider";
import { useUserContext } from "../../providers/UserProvider";
import Contact from "../Contact";

const ChatList = ({onNewChat, filter}) => {
    const { user } = useUserContext();
    const { chats, /* activeChatId,  */ startChat } = useChatContext();
    const [ chatArr, setChatArr ] = useState([]);

    useEffect(() => {
        if(!chats || !Object.keys(chats).length){return;}
        console.log(`New chats ->`, chats);
        let arr = (Object.values(chats)).sort((c1, c2) => {
            return c1.lastChatTimestamp > c2.lastChatTimestamp ? 1 : -1;
        });
        setChatArr(arr);
    }, [chats])

    useEffect(() => {
        if(!chats){return;}

        
        let arr = (Object.values(chats)).sort((c1, c2) => {
            return Number(c2.lastChatTimestamp) - Number(c1.lastChatTimestamp);
        });

        if(!filter){
            setChatArr(arr);
            return;
        }else {
            setChatArr(arr.filter((a) => {
                const { participants=[], isGroup, roomName } = a;
                let chatName = "";
                if(!isGroup){
                    let friend = participants.find(obj => obj.id !== user.uid);
                    if(friend){
                        chatName = friend.displayName;
                    }
                }else {
                    chatName = roomName;
                }
                chatName = chatName || "";
                console.log(chatName, filter);
                return chatName.toLowerCase().indexOf(filter.toLowerCase().trim()) > -1;
            }))
        }        
    }, [filter])


    return (
        <ChatListContainer>
            <ChatListHeader>
                <h3>Chats</h3>
                <ButtonContainer>
                    <AddChatButton onClick={onNewChat}>
                        <Add />
                    </AddChatButton>
                    <AddChatButton>
                        <GroupAdd/>
                    </AddChatButton>
                </ButtonContainer>
            </ChatListHeader>

            <ChatListWrapper>
                {
                    chatArr.map(({ id, isGroup=false, roomName, roomAvatar, participants=[] }) => {
                        let order = 0;
                        let friend;
                        if(!isGroup){
                            friend = participants.find(obj => obj.id !== user.uid);
                        }
                                                
                        /* if(activeChatId && id === activeChatId){
                            order = -2;
                        } */
                        return <ChatWrapper key={id} order={order}>
                            <Contact onSelect={() => {startChat(friend)}} {...friend}/>
                        </ChatWrapper>
                    })
                }

            </ChatListWrapper>
            
            
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

let AddChatButton =  styled.button`
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

const ButtonContainer = styled.div`
    display: inline-flex;
    gap: 1rem;
`

const ChatListWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const ChatWrapper = styled.div`
    display: flex;
    order: ${props => props.order || 0};
    position: relative;

    &:before {
        content: "";
        position: absolute;
        height: 100%;
        width: 4px;
        left: 0;
        top: 0;
        background-color: #128c7e;
        display: ${props => props.order === -2 ? 'inline-block' : 'none'}
    }
`

export default ChatList;