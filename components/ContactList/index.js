import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../providers/UserProvider';

function ContactList() {
    const { user } = useUserContext();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {}, [])
  return (
    <div>ContactList</div>
  )
}

export default ContactList