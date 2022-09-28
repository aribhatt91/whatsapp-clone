import { useContext, useEffect, useState, createContext } from 'react';
import { useChatContext } from './ChatProvider';

function ActiveChatProvider({children}) {
    const {activeChatId} = useChatContext();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    
}