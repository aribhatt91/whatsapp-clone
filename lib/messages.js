import {readDoc, readDocs, writeDoc, updateDocById} from './dbhelper';

const MESSAGES_COLLECTION = 'messages';

/* 
* @collection(messages)
*/

export const getMessagesForRoom = async (roomId, perPageLimit=null, lastIndex=null) => {
  const options = {
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
      },
      perPageLimit,
      lastIndex
  };
  return readDocs(MESSAGES_COLLECTION, options)
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


/* Offline */

export const saveMessageOffline = async (message) => {

}

export const getOfflineMessages = async (roomId) => {}

export const uploadOfflineMessages = async () => {}