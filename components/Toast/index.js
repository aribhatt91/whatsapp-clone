import {useState, useEffect} from 'react';
import styled from 'styled-components';

const Toast = ({id, text, type, dispatch, auto=true, delay=5}) => {
    const [exit, setExit] = useState(false);
    const [width, setWidth] = useState(0);
    const [intervalID, setIntervalID] = useState(null);

    const handleStartTimer = () => {
        const id = setInterval(() => {
            setWidth(prev => {
                if (prev < 100) {
                    return prev + 0.5;
                }

                clearInterval(id);
                return prev;
            });
        }, 20);

        setIntervalID(id);
    };

    const handlePauseTimer = () => {
        if(intervalID){
            clearInterval(intervalID);
        }
        
    };

    const handleCloseNotification = () => {
        //window.loginfo('Notification: handleCloseNotification called');
        handlePauseTimer();
        setExit(true);
        setTimeout(() => {
            dispatch({
                type: "REMOVE_NOTIFICATION",
                id: id
            })
        }, 400)
    };

    useEffect(() => {
        if (width === 100) {
        // Close notification
        handleCloseNotification()
        }
    }, [width])

    useEffect(() => {
        handleStartTimer();
    }, []);

    return (
        <StyledToast
        onMouseEnter={handlePauseTimer}
        onMouseLeave={handleStartTimer}
        className={`toast ${exit ? "toast--exit" : ""}`}
            >
            <ToastText className="app-notification__text">{text}</ToastText>
            {/* <span className="app-notification__close" onClick={handleCloseNotification}>&times;</span> */}
        </StyledToast>
    );
} 

const StyledToast = styled.div``;
const ToastText = styled.p``