import React from 'react'
import styled from 'styled-components'
import ChatAvatar from '../ChatAvatar';

function Contact({onSelect=() => {}, displayName="", photoURL, email, ...rest}) {
  return (
    <ContactContainer onClick={() => onSelect({email, displayName, photoURL, ...rest})}>
        <ContactAvatar>
            <ChatAvatar photoURL={photoURL} />
        </ContactAvatar>
        <ContactDetails>
            <ContactName>
                {displayName}
            </ContactName>
        </ContactDetails>
    </ContactContainer>
  )
}

const ContactAvatar = styled.div`
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ContactDetails = styled.div``;

const ContactName = styled.h5`
    font-weight: normal;
    word-break: break-word;
`;

const ContactContainer = styled.div`
    width: 100%;
    min-height: 64px;
    background: #fff;
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    transition: 0.25s;
    align-items: center;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`

export default Contact