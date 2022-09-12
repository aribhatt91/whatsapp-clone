import {readDoc, readDocs, writeDoc, updateDocById} from './dbhelper';

const USER_COLLECTION = 'users';

/* 
* @collection(users)
*/

export const getUser = async (user) => {
    return readDoc(USER_COLLECTION, (user.id || user.uid));
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