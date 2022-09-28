const idb = window.indexedDB;
const VERSION = 1;
const DB_NAME = 'whatsapp-db';

const MESSAGES_STORE = 'messages',
DRAFT_STORE = 'drafts';

const getDb = () => {
    const dbReq = idb.open(DB_NAME, VERSION);
    dbReq.onupgradeneeded = function(event){
        const db = event.target.result;
        if(!db.objectStoreNames.contains(MESSAGES_STORE)){
            const mstore = db.createObjectStore(MESSAGES_STORE, { keyPath: 'id' });
            mstore.createIndex("queuedForRoom",["roomId"], { unique: false })
        }
        if(!db.objectStoreNames.contains(DRAFT_STORE)){
            const dstore = db.createObjectStore(DRAFT_STORE, { keyPath: 'roomId' });
            dstore.createIndex("savedForRoom", ["roomId"], { unique: true })
        }
    }

    dbReq.onerror = console.error;

    return dbReq;
}

export const queueMessage = (messageObj, callback, errorFn) => {
    /* // Create a new transaction
    const txn = db.transaction(DB_NAME, 'readwrite');

    // Get the UserDetails object store
    const store = txn.objectStore(MESSAGES_STORE);
    // Insert a new record
    let query = store.put(user);

    // Handle the success case
    query.onsuccess = function (event) {
        console.log(event);
    };

    // Handle the error case
    query.onerror = function (event) {
        console.log(event.target.errorCode);
    }

    // Close the database once the transaction completes
    txn.oncomplete = function () {
        db.close();
    }; */

    const dbReq = getDb();

    dbReq.onsuccess = event => {
        const db = event.target.result;
        const tx = db.transaction(['messages'], 'readwrite'),
        store = tx.objectStore('messages');

        tx.oncomplete = () => {
            if(typeof callback === 'function'){
                callback();
            }else {
                console.log('Added a message', messageObj);
            }
            db.close();
        }

        tx.onerror = (event) => {
            if(typeof errorFn === 'function'){
                errorFn(event.target.errorCode);
            }else {
                console.error('error in saving message::',event.target.errorCode);
            }
        }
        
        store.add(messageObj);
    }
}

export const getAllPendingMessages = (roomId, callback) => {
    const dbReq = getDb(),
    messaegs = [];

    dbReq.onsuccess = event => {
        const db = event.target.result;
        const tx = db.transaction(['messages'], 'readwrite'),
        store = tx.objectStore('messages');

        tx.oncomplete = () => {
            if(typeof callback === 'function'){
                callback();
            }else {
                console.log('getAllPendingMessages');
            }
            db.close();
        }

        tx.onerror = (event) => {
            if(typeof errorFn === 'function'){
                errorFn(event.target.errorCode);
            }
        }

        tx.onabort = console.info;
        
        const range = IDBKeyRange.bound([roomId], [roomId]);
        let request = store.index('queuedForRoom').openCursor(range);

        request.onsuccess = (event) => {
            let cursor = event.target.result;

            if(cursor !== null){
                messaegs.push(cursor.value);
                cursor.continue();
            } else {
                if(typeof callback === 'function'){
                    callback(messaegs);
                }else {
                    console.log('getAllPendingMessages', messaegs);
                }
            }
        }

        request.onerror = console.error;
    }

    /* const dbPromise = getDb();
    dbPromise.then(db => {
        const tx = db.transaction('messages', 'readonly'),
        store = tx.objectStore('messages');
        const range = IDBKeyRange.bound([roomId], [roomId]);
        let request = store.index('queuedForRoom').openCursor(range);
        
        tx.oncomplete = () => {
            db.close();
        }

        request.onsuccess = function(event) {

        }

        //return store.getAll();
    }).then((messages) => {
        console.log('Message queued in indexDb::messages', messages);
        if(typeof callback === 'function') {
            callback(messages);
        }
    }).catch(error => {
        console.error('Error in indexDb::queueMessage', error);
    }); */
}

export const deletePendingMessages = (roomId, callback, errorFn) => {}

export const saveDraft = (roomId, messageObj, callback, errorFn) => {}

export const getDraft = (roomId, callback, errorFn) => {}

export const deleteDraft = (roomId, callback, errorFn) => {}