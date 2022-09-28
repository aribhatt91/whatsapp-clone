import { useState, useEffect, useContext, createContext } from 'react';
import useFetch from '../hooks/useFetch';

const NetworkStateContext = createContext();

export const useNetworkState = () => useContext(NetworkStateContext);

const NetworkStateProvider = ({children}) => {
    const [online, setOnline] = useState(window.navigator.onLine);
    //const {data, error, loading, abort} = useFetch('/api/hello');
    //console.log('NetworkStateProvider', data, error, loading, abort);

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