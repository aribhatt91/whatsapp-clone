class Room {
    constructor({id, isGroup, roomName, roomAvatar, members, unreadMessageCount, lastChatTimestamp}){
        if(!id){
            throw new Error('Missing required argument: id');
        }
        if(isGroup && !roomName){
            throw new Error('Missing required argument for the group: roomName');
        }
        this.#id = id;
        this.#isGroup = isGroup || false;
        this.#roomName = roomName || null;
        this.#roomAvatar = roomAvatar || null;
        this.#members = members || [];
        this.#unreadMessageCount = unreadMessageCount || 0;
        this.#lastChatTimestamp = lastChatTimestamp || null;
    }

    get id(){
        return this.#id;
    }

    get isGroup() {
        return this.#isGroup;
    }

    get participants() {
        return this.#participants;
    }

    get participantIds() {
        return this.#participants.map(p => p.id);
    }

    get unreadMessageCount() {
        return this.#unreadMessageCount;
    }

    get roomName() {
        return this.#roomName;
    }

    get roomAvatar() {
        return this.#roomAvatar;
    }

    get lastChatTimestamp() {
        return this.#lastChatTimestamp;
    }

    set lastChatTimestamp(timestamp) {
        this.#lastChatTimestamp = timestamp;
    }

    set roomAvatar(avatar) {
        this.#roomAvatar = avatar;
    }

    addPartcipant(participant) {
        if(!participant || !participant.id || !participant.displayName || !participant.email){
            throw new Error('Members must have a unique id, a displayName and an email field.');
        }
        this.#participants.push(participant);
    }

    removeMember(participantId) {
        if(!participantId){
            throw new Error('Missing argument. Expected a memberId');
        }
        this.#participants = this.#participants.filter(p => p.id !== participantId);
    }

    get() {
        const obj = {
            id: this.id,
            isGroup: this.isGroup,
            roomName: this.roomName,
            roomAvatar: this.roomAvatar,
            participantIds: this.participantIds,
            participants: this.participants,
            unreadMessageCount: this.unreadMessageCount,
            lastChatTimestamp: this.lastChatTimestamp
        }
        return obj;
    }

}