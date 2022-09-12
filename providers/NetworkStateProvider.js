import { useState, useEffect, useContext, createContext } from 'react';

const NetworkStateContext = createContext();

export const useNetworkState = useContext(NetworkStateContext);

const NetworkStateProvider = ({children}) => {
    const [online, setOnline] = useState(window.navigator.onLine);

    useEffect(() => {
        const onOnlineStateChange = () => {
            setOnline(window.navigator.onLine)
        }
        window.addEventListener('online', onOnlineStateChange);
        window.addEventListener('offline', onOnlineStateChange);
        return () => {
            window.removeEventListener('online', onOnlineStateChange);
            window.removeEventListener('offline', onOnlineStateChange);
        };
    }, []);

    

    return <NetworkStateContext.Provider value={online}>
        {children}
    </NetworkStateContext.Provider>
}

export default NetworkStateProvider;