import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Image, Message, Send } from "@material-ui/icons";
import { useChatContext } from '../../providers/ChatProvider';
import ActiveChat from '../ActiveChat';

/* 
Image upload functionality:
- On clicking image icon open folder.
- On selecting image, send it as chat bubble
- Trigger the sendMessage with image object
- sendMessage should save 

*/

function ChatBox() {
    const { activeChat, removeActiveChat, sendMessage } = useChatContext();
    const [ imageUpload, setImageUpload ] = useState([]);
    const messageBox = useRef(null);
    const imgUp = useRef(null);

    const _sendMessage = (e) => {
        e.preventDefault();
        if(imageUpload && imageUpload.length > 0){
            /* Send image instead of text */
        }
        if(messageBox.current) {
            const text = messageBox.current.value || "";
            if(text )
            sendMessage(text);
            messageBox.current.value = '';
        }
    }

    const openFolder = (e) => {
        e.preventDefault();
        if(imgUp.current) {
            imgUp.current.click();
        }
    }

    const uploadFile = (e) => {
        console.log(e.target.files[0]);
        try {

        }catch(error){

        }finally {
            setImageUpload()
        }
        
    }

    return (
        <ChatBoxContainer active={!!activeChat}>

            <ChatBoxWrapper>
                {
                    activeChat && <ActiveChat input={messageBox.current} />
                }
            </ChatBoxWrapper>

            <ChatInputContainer>
                <ChatInputWrapper>
                    <ChatInput ref={messageBox}></ChatInput>
                    <ImageUploadButton onClick={openFolder}>
                        <Image/>
                    </ImageUploadButton>
                    <input onChange={uploadFile} className='img-upload hidden' type="file" accept="image/png, image/jpeg" ref={imgUp} />
                </ChatInputWrapper>
                
                

                <ChatActionButton disabled={!activeChat} onClick={_sendMessage}>
                    <Send/>
                </ChatActionButton>

            </ChatInputContainer>
        </ChatBoxContainer>
    )
}

const ChatBoxContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
    padding: 1rem;
    max-height: 100%;
    overflow: hidden;

    @media (max-width: 768px) {
        transition: 0.25s all ease-in-out;
        min-width: 100%;
        transform: translateX(${props => props.active ? '-100%': '0'});
    }
`;

const ChatBoxWrapper = styled.div`
    flex: 1;
    background: #fff;
    border-radius: 24px;
    max-height: calc(100% - 1rem - 64px);
    height: calc(100% - 1rem - 64px);
`;

const ChatInputContainer = styled.form`
    height: 64px;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    

    .img-upload {
        display: none;
    }
`;

const ChatInputWrapper = styled.div`
    position: relative;
    flex: 1;
    width: 100%;
    height: 64px;
    background: #fff;
    border-radius: 32px;
    border: none;
    outline: none;
    padding-right: 60px
`;

const ImageUploadButton = styled.div`
    position: absolute;
    width: 56px;
    height: 56px;
    border-radius: 56px;
    right: 4px;
    top: 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    svg {
        fill: #888;
    }
`

const ChatInput = styled.input.attrs(({disabled}) => {
    type: 'textarea'
})`
    width: 100%;
    height: 64px;
    background: #fff;
    border-radius: 32px;
    border: none;
    padding: 0 1rem;
    outline: none;
`

const ChatActionButton = styled.button.attrs((props) => {
    type: 'button'
})`
    width: 56px;
    height: 56px;
    border: none;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #128c7e;
    border-radius: 56px;

    &[disabled] {
        pointer-events: none;
        opacity: 0.5
    }
`

export default ChatBox