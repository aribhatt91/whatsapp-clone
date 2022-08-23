import styled from "styled-components";
import SearchBar from "../SearchBar";
import * as EmailValidator from 'email-validator';
import { useUserContext } from "../../providers/UserProvider";
import { useState } from "react";
import Modal from "../Modal";
import ChatList from "../ChatList";
import Button from "../Button";

function SideBar() {
    const {user} = useUserContext();
    const [show, setShow] = useState(false);

    console.log('Logging from Sidebar', user);
    const createChat = () => {
        setShow(true);
        /* const input = prompt('Please enter an email address for the user you want to chat with');

        if(!input){
            return null;
        }
        if(EmailValidator.validate(input)){

        } */
    };

    const onClose = () => {
        setShow(false);
    }
  return (
    <SideBarContainer>
        
        
        <SearchBar/>
        <ChatList onNewChat={createChat} />

        {/* List of chats */}
        {
            show && <Modal onClose={() => setShow(false)} >
                <h1>Start a chat</h1>
                <p>jfhjkhlfh dhfklfdh hdskl udks sdilks jdlsjlfsh jhkdjhksd dhskjkj dkjshkjd jahj bjha jhjv hh jhjha jhjsd</p>
            </Modal>
        }
    </SideBarContainer>
  )
}

export default SideBar;

const SideBarContainer = styled.div`
    padding: 1rem;
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
`;


const SideBarButton = styled(Button)`
    width: 100%;
    background: transparent;

`

