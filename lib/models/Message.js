import { v4 as uuidv4 } from 'uuid';

export const MESSAGE_TYPE = {
    TEXT: 1,
    IMAGE: 2,
    LINK: 3,
    EMOTICON: 4
};

const Message = (roomId, senderId, content, recipients=[], timestamp=null, type=MESSAGE_TYPE.TEXT) => {
    const id = uuidv4();

    return {
        id,
        roomId,
        text: type == MESSAGE_TYPE.TEXT ? content || "" : null,
        imgUrl: type === MESSAGE_TYPE.IMAGE ? content || "" : null,
        senderId,
        recipients: recipients.filter(rid => rid !== senderId),
        timestamp: timestamp || Date.now(),
        status: 'QUEUED',
        type
    }
}

export default Message;