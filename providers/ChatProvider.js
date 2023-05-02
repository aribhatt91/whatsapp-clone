import { useContext, useEffect, useState, createContext, useRef } from 'react';
import { useUserContext } from './UserProvider';
import { addRoom, getRoomsForUser, getRoomById, updateRoom } from '../lib/rooms';
import { getMessagesForRoom, addMessageForRoom, saveMessageOffline, uploadOfflineMessages, getOfflineMessages } from '../lib/messages';
import uniqueHash from "unique-hash";
import { useSocketContext } from './SocketProvider';
import { v4 as uuidv4 } from 'uuid';
import { useNetworkState } from './NetworkStateProvider';

import Message, { MESSAGE_TYPE } from '../lib/models/Message';

const ChatContext = createContext();

const TEST_OFFLINE_MODE = false;
const MESSAGES_PER_PAGE = 50;

let typingStateCallback = null;

export const useChatContext = () => useContext(ChatContext);

const reducer = (state, action) => {
    switch(action.type) {
        case 'ADD_NEW_CHAT':
            return state
    }
}

function ChatProvider({children}) {

    const [activeChat, setActiveChat] = useState(null);
    const [activeChatId, setActiveChatId] = useState(null);
    const [chats, setChats] = useState({});
    const [loadingMessages, setLoadingMessages] = useState(false);
    const {user} = useUserContext();
    const { socket } = useSocketContext();
    const online = useNetworkState();

    const stateRef = useRef({
        activeChatId,
        activeChat,
        chats
    });

    const renderCount = useRef(0);

    useEffect(() => {
        console.log('stateRef', stateRef);
        stateRef.current = {
            activeChatId,
            activeChat,
            chats
        }
    })

    /* Create a unique 1 to 1 Room Id based on the particpant IDs */
    const getChatRoomId = (otherIds) => uniqueHash([user.uid, ...otherIds].sort().join('|'))

    /* 
    
    SOCKET HELPER METHODS
    
    */
    const joinRoomOverSocket = () => {
        if(activeChatId && socket){
            socket.emit('join-room', { room: activeChatId })
        }
    }

    const sendMessageOverSocket = (recipient, message, toGroup=false) => {
        if(TEST_OFFLINE_MODE){return};
        
        try{
            if(socket && recipient) {
                console.log('sendMessageOverSocket', socket, recipient, message);
                if(toGroup){
                    socket.emit('send-message-group', {recipient, message, sender: user.uid})
                }else {
                    socket.emit('send-message', { message })
                }
                
            }
        }catch(error){
            console.error(error);
        }
    }

    const sendUserHasSeenStatus = (roomId) => {
        if(TEST_OFFLINE_MODE){return};
        
        if(socket) {
            socket.emit('seen-message', {roomId, userId: user.uid});
        }
    }

    /* @event(ack-seen-message) */
    const recieveUserHasSeenStatus = ({roomId, userId}) => {
        if(TEST_OFFLINE_MODE){return};
        
        if(chats[roomId] && userId !== user.uid){
            let chat = {...chats[roomId]};

            /* Update partcipants array for the chat room with the latest seen state */
            chat.participants = chat.participants.map(participant => {
                
                if(participant.id === userId){
                    let p = {...participant};
                    p.unreadMessageCount = 0;
                    return p;
                }

                return participant;
            });

            if(roomId === activeChatId) {
                setActiveChat(chat);
            }

            /* Update list of chats */
            setChats(prevChats => {
                return {
                    ...prevChats,
                    [roomId]: chat
                }
            })
        }
    }

    /* TYPING STATE */

    const sendIsTypingState = (state) => {
        if(TEST_OFFLINE_MODE || !socket){return};

        if(stateRef.current.activeChatId && user) {
            socket.emit('typing-state', {state, roomId: stateRef.current.activeChatId, userId: user.uid, displayName: user.displayName});
        }
    }

    const onRecieveIsTypingState = ({state, roomId, userId, displayName}) => {
        if(TEST_OFFLINE_MODE){return};

        if(typeof typingStateCallback === 'function' && roomId === stateRef.current.activeChatId){
            typingStateCallback({state, roomId, userId, displayName});
        }
    }

    const registerTypingStateCallback = (callback) => typingStateCallback = callback;

    const unregisterTypingStateCallback = (callback) => typingStateCallback = null;
    
    /* ---- */

    const pingIsUserOnline = (userId) => {
        if(socket){
            socket.emit('is-online', {userId});
        }
    }
    /* 
    @param(messageObject)
    */
    const foo = () => {
        console.log('foo', { chats: stateRef.current.chats, activeChat: stateRef.current.activeChat, activeChatId});
    }

    const onRecieveMessageOverSocket = async ({message}) => {
        foo();
        console.log('onRecieveMessageOverSocket', message, stateRef.current.chats );
        if(TEST_OFFLINE_MODE || !message){return};

        let chatId, 
        chat = null;
        chatId = `${message.roomId}`;

        if(!chatId){
            console.log('No chat Id found, returning...');
            return;
        }

        /* If Chat is present */
        if(stateRef.current.chats[chatId]){

            chat = {...stateRef.current.chats[chatId]};

            /* 
            Update user's unreadMessageCount depending upon whether the chat is currently active 
            */
            chat.participants = chat.participants || [];
            chat.participants = chat.participants.map(participant => {
                let p = {...participant};
                if(p.id === user.uid){
                    if(activeChat && chatId === activeChat.id){
                        p.unreadMessageCount = 0;
                    }else {
                        p.unreadMessageCount = (p.unreadMessageCount || 0) + 1;
                    }
                }
                return p;
            });

            /* 
            If chat is currently active, push the live messages to the active chat and update the state 
            */
            console.log('Updating active chat', chatId, stateRef.current.activeChatId);
            if(stateRef.current.activeChat && chatId === stateRef.current.activeChatId) {
                

                chat.messages = stateRef.current.activeChat.messages || [];
                chat.messages.unshift(message);

                /* 
                If not a group, assign the other partcipant's details as Group's avatar and name 
                */
                if(!chat.isGroup){
                    let friend = chat.participants.find(u => u.id !== user.uid);

                    chat.roomName = friend && friend.displayName || "";
                    chat.roomAvatar = friend && friend.photoURL || "";
                }
                console.log('Updating active chat', chat);
                setActiveChat({
                    ...chat
                });

                sendUserHasSeenStatus(stateRef.current.activeChatId);

                /* Update unread count for the user */
                updateRoom(chatId, { participants: chat.participants });

            }

        }else {
            console.log('Existing chat not found for Id', {chatId, chats, activeChat, activeChatId});
            /* If the chat is not present and the user recieves the first message */
            chat = await getRoomById(chatId);
            /* chat.unreadMessageCount = chat.unreadMessageCount || 0;
            chat.unreadMessageCount += 1; */
        }
        if(!chat){
            console.log('For some reason chat wasnt updated');
            return;
        }
        console.log('Updating chat');
        setChats((prevChats) => {
            console.log('Setting new chat', chat)
            return {
                ...prevChats,
                [chatId]: chat
            }
        });
    }

    
    /* 
    
    SOCKET HELPER METHODS END
    
    */

    /*
    @param(friend) 
    Given a friend, return a new chat object 
    */
    const createNewChat = ({id, displayName, photoURL, email}) => {
        return {
            id: getChatRoomId([id]),
            participantIds: [user.uid, id],
            isGroup: false,
            participants: [{
                id: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                unreadMessageCount: 0,
                isTyping: false
            },
            {
                id,
                email,
                displayName,
                photoURL,
                unreadMessageCount: 0,
                isTyping: false
            }],
            lastChatTimestamp: Date.now()
        }
    }

    /* 
    @param(friend)
    Takes a friend object and sets a chat room to active state.
    */

    const startChat = (friend) => {

        const chatId = getChatRoomId([friend.id]);

        /* Check if chat instance is present and set it as activeChat */
        let chat = chats[chatId];
        
        /* If not create a new instance and set it as activeChat */
        
        if(!chat){
            chat = createNewChat(friend);
            chat.notYetDirty = true;
            console.log('Creating a new chat ', chat);
            setChats(prevChats => {
                return{
                    ...prevChats,
                    [chat.id]: chat
                }
            });
        }
        

        if(activeChatId !== chat.id) {
            if(activeChatId){
                socket.emit('leave-room', {room: activeChatId});
            }
            setActiveChatId(prevId => chat.id);

            if(!chat.isGroup){
                chat.roomName = friend.displayName;
                chat.roomAvatar = friend.photoURL;
            }
            
            setActiveChat({...chat});
            
            sendUserHasSeenStatus(chat.id);
        }
    }

    /* 
    @param (message)
    */
    const sendMessage = (message, messageType=MESSAGE_TYPE.TEXT) => {

        if(!activeChat){
            throw new Error('No active chat found to send message');
        }

        let friend;
        //const chatId = getChatRoomId([friend.id]);

        /* if(!activeChat || chatId !== activeChatId){
            startChat(friend);
        } */

        if(!activeChat.isGroup) {
            friend = activeChat.participants.find(u => u.id !== user.uid);
        }        


        if(message && activeChat.id === activeChatId) {
            let chat = {...activeChat};

            if(chat.notYetDirty){
                delete chat.notYetDirty;
                /* Save chat room to DB only when the first message is sent */
                addRoom(chat);
            }
            chat.lastChatTimestamp = Date.now();
            const messageObj = Message(activeChatId, user.uid, message, activeChat.participantIds, messageType);
            console.log('sendMessage::', messageObj);
            /* Web socket */
            sendMessageOverSocket(friend.id, messageObj);

            /* Save message in DB */
            addMessageForRoom(messageObj);

            let participants = chat.participants.map(participant => {
                let p = {...participant};
                if(p.id === friend.id){
                    p.unreadMessageCount = p.unreadMessageCount || 0;
                    p.unreadMessageCount += 1;
                }
                return p;
            });

            chat.messages = chat.messages || [];
            chat.messages.unshift(messageObj);

            /* Update active chat with the messages */
            setActiveChat(prevChat => {

                return {
                    ...chat,
                    roomName: chat.isGroup ? chat.roomName : friend.displayName || "",
                    roomAvatar: chat.isGroup ? chat.roomAvatar : friend.photoURL || "",
                    participants
                }

            });

            /* 
            TODO: Update the chats with the same data
            */


            /* Update unread count for the recipient */
            updateRoom(chat.id, { participants });
        }

    }

    const removeActiveChat = () => {

        if(activeChat && activeChat.notYetDirty){
            /* If no message was sent or recieved in the new chat, remove it from the list of chats */
            const newChats = {...chats};
            delete newChats[activeChat.id];
        }
        /* 
        * If user has a draft, save it in local storage/indexDb with chatId as key 
        */
        if(activeChatId){
            socket.emit('leave-room', {room: activeChatId});
        }

        setActiveChat(null);
        setActiveChatId(null);
    }

    const createNewGroup = async (groupName, participants=[]) => {
        if(!groupName || typeof groupName !== 'string') {
            throw new Error('Missing argument: groupName');
        }
        const groupId = uniqueHash(`${groupName}|${Date.now()}`);

        const group = {
            id: groupId,
            isGroup: true,
            roomName: groupName,
            participants
        }
    }

    const addUserToGroup = async (groupId, newUser) => {
        /* Remember to broadcast this to all members so that they get notified of new member without reopening the app */
    }

    const removeUserFromGroup = async (groupId, user) => {}

    const leaveGroup = async (groupId) => {}

    /* 
    
    Fetch more messages 
    @param: (first:boolean) 
    In case of first call, lastIndex is ignored, for subsequent calls, new call is sent only if lastIndex is not null 
    
    */
    const loadMessages = async (first=false, messageCount) => {
        if(stateRef.current.activeChatId && (first || stateRef.current.activeChat.lastIndex)) {
            try {
                setLoadingMessages(true);

                const { data, lastIndex } = await getMessagesForRoom(stateRef.current.activeChatId, (messageCount || MESSAGES_PER_PAGE), stateRef.current.activeChat ? stateRef.current.activeChat.lastIndex : null);

                console.log('Response from getMessagesForRoom', data);

                setActiveChat(prev => {
                    return {
                        ...prev, 
                        messages: (prev.messages || []).concat(data), 
                        lastIndex: data.length < (messageCount || MESSAGES_PER_PAGE) ? null : lastIndex
                    }
                });

            }catch(error) {
                console.error('loadMessages::error:', error);
            }finally {
                setLoadingMessages(false);
            }
            
        }
    }


    useEffect(async () => {
        if(user){
            /* 
            This is where we set the process in motion to update chats
            */
            try{
                const {data=[]} = await getRoomsForUser(user);
                const chatsObj = {};
                data.forEach(room => {
                    chatsObj[room.id] = room;
                })
                setChats(chatsObj);
            }catch(error) {

            }
           
        }
    }, [user]);

    useEffect(() => {
        console.log('socket modified', socket);
        if(socket){
            socket.on('recieve-message', onRecieveMessageOverSocket);
            socket.on('ack-typing-state', onRecieveIsTypingState)
            joinRoomOverSocket();
        }
        //return () => socket && socket.close();
    }, [socket]);

    useEffect(async () => {
        console.log('activeChatId modified', activeChatId);
        if(activeChatId){
            try{
                //setLoadingMessages(true);
                joinRoomOverSocket();
                /* Fetch all messages for an active chat */
                /* Ideally this should be localised for fast fetch */

                loadMessages(true, 20);

                const chat = chats[activeChatId];

                const participants = activeChat.participants;

                participants.forEach(p => {
                    if(p.id === user.uid){
                        p.unreadMessageCount = 0;
                    }
                });
    
                /* Update unread count for friend */
                updateRoom(chat.id, { participants });

                              
            }catch(error){
                console.error(error);
            }finally{
                //setLoadingMessages(false);
            }
            
        }
    }, [activeChatId]);

    useEffect(async () => {
        if(online) {
            /* Check if there are queued mesages in local db and save them to Firestore */
        }
    }, [online])

    const value = {
        loadingMessages,
        activeChatId,
        activeChat,
        chats,
        startChat,
        sendMessage,
        onRecieveMessageOverSocket,
        sendIsTypingState,
        registerTypingStateCallback,
        unregisterTypingStateCallback,
        loadMessages,
        createNewGroup,
        addUserToGroup,
        removeUserFromGroup,
        removeActiveChat,
        leaveGroup
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider