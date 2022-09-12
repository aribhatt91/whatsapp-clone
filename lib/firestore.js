import { db, FieldValue } from "../firebase";
import { doc, addDoc, updateDoc, getDocs, getDoc, setDoc, query, where, collection, orderBy, startAfter } from "firebase/firestore";

//import { async } from "@firebase/util";

const USER_COLLECTION = 'users',
ROOMS_COLLECTION = 'rooms',
MESSAGES_COLLECTION = 'messages';

const DB_SWITCHED_OFF = false;

const reacDocs = async (dbName, options) => {

    if(DB_SWITCHED_OFF) {
        return Promise.resolve({});
    }

    const { comparisons=[], sort=null, perPageLimit, page=1, lastIndex=null } = options;
    
    try{
        let data = [];
        const ref = collection(db, dbName);

        const params = [];

        comparisons.map(comparison => params.push(where(comparison.key, comparison.comparator || '==', comparison.value)));

        if(sort) {
            params.push(orderBy(sort.by, sort.desc ? 'desc' : 'asc'));
        }
        
        if(lastIndex && perPageLimit){
            params.push(startAfter(lastIndex))
        }

        if(perPageLimit){
            params.push(limit(perPageLimit))
        }

        console.log('reading docs', dbName, options, data);
        
        let q = query(ref, ...params);

        const documentSnapshots = await getDocs(q);
        lastIndex = documentSnapshots.docs[documentSnapshots.docs.length-1];

        documentSnapshots.forEach(doc => data.push(doc.data()));
        
        return new Promise((resolve) => resolve({data, lastIndex}))
    }catch(error){
        console.error(error);
        return new Promise((resolve, reject) => reject(error));
    }
}

const reacDoc = async (dbName, docId) => {

    if(DB_SWITCHED_OFF) {
        return Promise.resolve({});
    }

    try{
        const ref = doc(db, dbName, docId);
        
        const doc = await getDoc(ref);

        if(doc.exists()){
            return new Promise((resolve) => resolve(doc.data()))
        }else {
            throw new Error('No document found in the collection!')
        }
    }catch(error){
        return new Promise((resolve, reject) => reject(error));
    }
}

const writeDoc = (dbName, docId, update) => {

    if(DB_SWITCHED_OFF) {
        return;
    }

    try{
        const ref = collection(db, dbName)
        if(docId === null) {
            addDoc(ref, update)
            .then(res => console.log(`Added ${dbName} record: ${docId} successfully`, res))
            .catch(error => console.error(`Firestore::functions::addDoc::${dbName}::error`, error));
        }else {
            setDoc(doc(ref, docId), update, { merge: true })
            .then(res => console.log(`Set ${dbName} record: ${docId} successfully`, res))
            .catch(error => console.error(`Firestore::functions::setDoc::${dbName}::error`, error));
        }
    }catch(error){
        console.error(`Firestore::functions::writeDoc::${dbName}::error`, error);
    }
}

const updateDocById = async (dbName, docId, update) => {

    if(DB_SWITCHED_OFF) {
        return;
    }
    
    try{
        updateDoc(doc(db, dbName, docId), update)
        .then(res => console.log(`Updated ${dbName} record: ${docId} successfully`, res))
        .catch(error => console.error(`Firestore::functions::updateDocById::${dbName}::error`, error));
    }catch(error){
        console.error(`Firestore::functions::writeDoc::${dbName}::error`, error);
    }
}

/* 
* @collection(users)
*/

export const getUser = async (user) => {
    return reacDoc(USER_COLLECTION, (user.id || user.uid));
}

export const updateUser = async (user) => {
    writeDoc(USER_COLLECTION, user.uid, {
        email: user.email,
        id: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        lastSeen: (new Date()).toUTCString()
    });
}

/* 
* @collection(messages)
*/

export const getMessagesForRoom = async (roomId, limit, page, lastIndex) => {
    console.log('getMessagesForRoom called', roomId);
    return reacDocs(MESSAGES_COLLECTION, {
        comparisons: [
            {
                key: 'roomId',
                comparator: '==',
                value: roomId
            }
        ],
        sort: {
            by: 'timestamp',
            desc: true
        }
    })
}

export const addMessageForRoom = async (message) => {
    if(message){
        message.timestamp = Date.now();
    }
    writeDoc(MESSAGES_COLLECTION, null, message);
}

export const editMessage = async (messageId, updatedText) => {
    updateDocById(MESSAGES_COLLECTION, updatedMessage.id, {text: updatedText});
}

/* This function doesn't really delete the message from the table, rather updates it's text */
export const deleteMessage = async (messageId) => {
    updateDocById(MESSAGES_COLLECTION, updatedMessage.id, {text: 'This message has been deleted'});
}

/* 
* @collection(rooms)
*/

export const getRoomById = async (roomId) => {
    return reacDoc(ROOMS_COLLECTION, roomId);
}

export const getRoomsForUser = async (user, limit, page, lastIndex) => {
    return reacDocs(ROOMS_COLLECTION, {
        comparisons: [
            {
                key: 'participantIds',
                comparator: 'array-contains',
                value: user.uid
            }
        ],
        sort: {
            by: 'lastChatTimestamp',
            desc: true
        }
    })
}

export const addRoom = async (room) => {
    writeDoc(ROOMS_COLLECTION, room.id, room);
}

export const updateRoom = async (roomId, update) => {
    updateDocById(ROOMS_COLLECTION, roomId, update);
}


/* Groups */

export const createGroup = async (groupId, groupName, members) => {
    const group = {
        id: groupId,
        roomName: groupName
    }
    addRoom(group);
}

export const addMemberToGroup = async (groupId, members=[]) => {}

export const removeMemberFromGroup = async (groupId, member) => {}

