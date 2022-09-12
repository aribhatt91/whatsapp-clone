const indexDB = window.indexDB;
const VERSION = 1;
const DB_NAME = 'whatsapp-db';

const MESSAGES_STORE = 'messages',
DRAFT_STORE = 'drafts';

const getDb = () => {
    const dbPromise = indexDB.open(DB_NAME, VERSION, function(db){
        if(!db.objectStoreNames.contains(MESSAGES_STORE)){
            const mstore = db.createObjectStore(MESSAGES_STORE, { keyPath: 'id' });
            mstore.createIndex("queuedForRoom",["roomId"], { unique: false })
        }
        if(!db.objectStoreNames.contains(DRAFT_STORE)){
            const dstore = db.createObjectStore(DRAFT_STORE, { keyPath: 'roomId' });
            dstore.createIndex("savedForRoom", ["roomId"], { unique: true })
        }
    });

    return dbPromise;
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

    const dbPromise = getDb();
    dbPromise.then(db => {
        const tx = db.transaction('messages', 'readwrite'),
        store = tx.objectStore('messages');
        tx.oncomplete = () => {
            db.close();
        }
        
        let query = store.add(messageObj);
        // Handle the success case
        query.onsuccess = (event) => {
            console.log(event);
        };

        // Handle the error case
        query.onerror = (event) => {
            throw new Error(event.target.errorCode);
        }

        return tx.complete;
    }).then(() => {
        console.log('Message queued in indexDb::messages');
        if(typeof callback === 'function') {
            callback();
        }
    }).catch(error => {
        console.error('Error in indexDb::queueMessage', error);
    }) 
}

export const getAllPendingMessages = (roomId, callback) => {
    const dbPromise = getDb();
    dbPromise.then(db => {
        const tx = db.transaction('messages', 'readonly'),
        store = tx.objectStore('messages');
        tx.oncomplete = () => {
            db.close();
        }
        const range = IDBKeyRange.bound([roomId], [roomId]);
        const request = store.index('queuedForRoom').openCursor(range);
        
        //return store.getAll();
    }).then((messages) => {
        console.log('Message queued in indexDb::messages', messages);
        if(typeof callback === 'function') {
            callback(messages);
        }
    }).catch(error => {
        console.error('Error in indexDb::queueMessage', error);
    });
}

export const deletePendingMessages = (roomId, callback, errorFn) => {}

export const saveDraft = (roomId, messageObj, callback, errorFn) => {}

export const getDraft = (roomId, callback, errorFn) => {}

export const deleteDraft = (roomId, callback, errorFn) => {}