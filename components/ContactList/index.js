import React, { useEffect, useMemo, useState } from 'react'
import { useUserContext } from '../../providers/UserProvider';
import SearchBar from '../SearchBar';
import styled from "styled-components";
import useMockFetch from '../../hooks/useMockFetch';
import Contact from '../Contact';
import useGetFirestoreDb from '../../hooks/useGetFirestoreDb';


let ALLCONTACTS = [];

function ContactList({onSelectContact=()=>{}}) {
    const { user } = useUserContext();
    const [contacts, setContacts] = useState([]);
    //const { data, loading, error } = useMockFetch('/contacts.json');
    const { data, loading, error } = useGetFirestoreDb('users');


    useEffect(() => {
        /* fetch contacts for the user */
        if(data && !error && user) {
            setContacts([...data].filter(c => c.id !== user.uid));
        }
    }, [data, user]);



    const filter = (searchTerm) => {
        if(!data || error || !data.length){
            return;
        }
        if(searchTerm && searchTerm.trim() !== ''){
            const arr = data.filter(contact => {
                const name = contact.displayName?.toLowerCase() || "",
                email = (contact.email || "").toLowerCase();
                return name.indexOf(searchTerm.trim()) > -1 || email.indexOf(searchTerm.trim()) > -1;
            });
            setContacts(arr);
        }else {
            setContacts([...data]);
        }
        console.log(searchTerm);
    }
  return (
    <ContactListContainer>
        <ContactListHeader>Start a chat</ContactListHeader>
        <SearchBar onSearch={filter} />
        <Contacts>
            {
                loading && <span>Loading...</span>
            }
            {
                !loading && data && contacts.map(contact => <Contact key={contact.id} onSelect={onSelectContact} {...contact} />)
            }
            {
                !loading && error && error.message
            }
        </Contacts>
    </ContactListContainer>
  )
}

const ContactListContainer = styled.div`
    width: 500px;
    height: 100vh;
    max-width: 100%;
    max-height: 700px;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    

    @media (max-width: 768) {
        padding: 2rem 1.5rem;
    }
`

const ContactListHeader = styled.h2`
    margin-top: 0;
    font-weight: normal;
    padding: 0 1rem;
`

const Contacts = styled.div`
    margin-top: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-height: 100%;
    overflow: auto;
`

export default ContactList