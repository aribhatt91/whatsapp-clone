import { useEffect, useState } from 'react'
import { getLastSeen } from '../../lib/lastseen';
import styled from 'styled-components';

let interval;

function LastSeenStatus({userId}) {
    const [lastSeen, setLastSeen] = useState(null);

    const getLastSeenText = (timeGap) => {
        if(timeGap < 60) {
          return `Online`
        }else if(timeGap > 60 && timeGap < 3600) {
          const diff = Math.ceil(timeGap/60)
          return `Last seen ${diff} minute${diff > 1 ? 's' : ''} ago`
        }else if(timeGap > 3600 && timeGap < 24*3600) {
          const diff = Math.ceil(timeGap/3600)
          return `Last seen ${diff} hour${diff > 1 ? 's' : ''} ago`
        }else {
          const diff = Math.ceil(timeGap/(24*3600))
          return `Last seen ${diff} day${diff > 1 ? 's' : ''} ago`
        }
    }
  
    const updateLastSeen = async () => {
        try {
            if(userId){
                const lastSeenRes = await getLastSeen(userId);
                const diff = (Date.now() - Number(lastSeenRes.timestamp))/1000;
                const lastSeenText = getLastSeenText(diff);
                console.log(lastSeenText);
                setLastSeen(lastSeenText);
                //setIsOnline(diff < 60);            
            }else {
                clearInterval(interval);
                setLastSeen(null);
            }
        }catch(error) {
            console.error('Error in updating last seen in active chat', error);
            setLastSeen(null);
        } 
    }

    useEffect(() => {
        if(!userId) {
            return
        }
        clearInterval(interval);
        setLastSeen(null);
        updateLastSeen();
        interval = setInterval(updateLastSeen, 30000);
        return () => clearInterval(interval)
    }, [userId])
    return (
        <LastSeenText>{lastSeen || ""}</LastSeenText>
    )
}

export default LastSeenStatus

const LastSeenText = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: #888;
`