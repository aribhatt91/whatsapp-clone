import styled from "styled-components";
import SearchBar from "../SearchBar";
import { useState } from "react";
import Modal from "../Modal";
import ChatList from "../ChatList";
import Button from "../Button";
import ContactList from "../ContactList";
import { useChatContext } from "../../providers/ChatProvider";

function SideBar() {
    const [show, setShow] = useState(false);
    const { startChat } = useChatContext();

    //console.log('Logging from Sidebar', user);
    const createChat = () => {
        setShow(true);
    };

    const createGroup = () => {}

    const onSelectContact = (user) => {
        console.log(user);
        startChat(user);
        setShow(false);

    }
  return (
    <SideBarContainer>
        
        
        <SearchBar/>
        <ChatList onNewChat={createChat} />

        {/* List of chats */}
        {
            show && <Modal onClose={() => setShow(false)} >
                <ContactList onSelectContact={onSelectContact} />
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

