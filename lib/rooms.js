import {readDoc, readDocs, writeDoc, updateDocById} from './dbhelper';

const ROOMS_COLLECTION = 'rooms';

/* 
* @collection(rooms)
*/

export const getRoomById = async (roomId) => {
    return readDoc(ROOMS_COLLECTION, roomId);
}

export const getRoomsForUser = async (user, limit, page, lastIndex) => {
    return readDocs(ROOMS_COLLECTION, {
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