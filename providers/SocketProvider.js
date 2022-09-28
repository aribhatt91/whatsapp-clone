import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from './UserProvider';

const SocketContext = React.createContext();

export const useSocketContext = () => useContext(SocketContext);
const SOCKET_URL = 'http://localhost:5600';//'/api/socket';


export default function SocketProvider ({children}) {
    const { user } = useUserContext();
    const [ socket, setSocket ] = useState();

    useEffect(() => {
        const socketInitialiser = async () => {
            if(user && user.uid){
                //await fetch(SOCKET_URL);
                //const newSocket = io();
                const newSocket = io(SOCKET_URL, {query: {id: user.uid}});
    
                newSocket.on("connect", () => {
                    console.log('Connected to socket ', newSocket.id); // x8WIv7-mJelg7on_ALbx
                    /* if(user){
                        newSocket.emit('join-room', {room: user.uid});
                    } */
                });
        
                newSocket.on("disconnect", () => {
                    console.log('Socket disconnected', newSocket);
                    /* if(!newSocket.id) {
                        setSocket(prev => io('http://localhost:5600'));
                    } */
                });
        
                newSocket.on("connect_error", (err) => {
                    console.log(err instanceof Error); // true
                    console.log(err.message); // not authorized
                    console.log(err.data); // { content: "Please retry later" }
                });
        
                setSocket(newSocket);
            }
        }

        socketInitialiser();
        
        
        
        //return () => newSocket.close();
    }, [user])

    const value = {
        socket
    }

    return <SocketContext.Provider value={value}>
        {children}
    </SocketContext.Provider>

}