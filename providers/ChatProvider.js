import React, {useContext, useEffect, useState} from 'react'
import { useUserContext } from './UserProvider';

const ChatContext = React.createContext();

export const useChatContext = () => useContext(ChatContext);

function ChatProvider({children}) {
    const [activeChat, setActiveChat] = useState(null);
    const [chats, setChats] = useState([]);
    const {user} = useUserContext();

    const fetchChat = (email) => {}

    const addNewChat = (email) => {}

    const value = {
        activeChat,
        chats,
        fetchChat,
        addNewChat
    }

    useEffect(() => {
        if(user){
            /* 
            Websocket?
            Long polling?
            This is where we set the process in motion to update chats
            */
        }
    }, [user])

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider