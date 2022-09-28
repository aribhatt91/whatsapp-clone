import {readDoc, readDocs, writeDoc, updateDocById} from './dbhelper';

const USER_COLLECTION = 'users';

/* 
* @collection(users)
*/

export const getUser = async (user) => {
    return readDoc(USER_COLLECTION, (user.id || user.uid));
}

export const updateUser = async ({uid, email, photoURL, displayName}) => {
    writeDoc(USER_COLLECTION, uid, {
        email,
        id: uid,
        photoURL,
        displayName,
        lastSeen: (new Date()).toUTCString()
    });
}