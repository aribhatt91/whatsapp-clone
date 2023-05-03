import {readDoc, updateDocById} from './dbhelper';

const SEEN_COLLECTION = 'lastseen';

/* 
* @collection(lastseen)
*/

export const updateLastSeen = async (userId) => {
    updateDocById(SEEN_COLLECTION, userId, {
        timestamp: Date.now().toString()
    })
}

export const getLastSeen = async (userId) => {
    return readDoc(SEEN_COLLECTION, userId);
}